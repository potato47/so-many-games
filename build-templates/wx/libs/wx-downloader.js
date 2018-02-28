/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ID = 'WXDownloader';

var non_text_format = [
    'js','png','jpg','bmp','jpeg','gif','ico','tiff','webp','image','mp3','ogg','wav','m4a','font','eot','ttf','woff','svg','ttc'
];

var fs = wx.getFileSystemManager();

var WXDownloader = window.WXDownloader = function () {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this.REMOTE_SERVER_ROOT = '';
};
WXDownloader.ID = ID;

WXDownloader.prototype.handle = function (item, callback) {
    if (item.type === 'js') {
        callback(null, null);
        return;
    }
    if (item.type === 'uuid') {
        var result = cc.Pipeline.Downloader.PackDownloader.load(item, callback);
        // handled by PackDownloader
        if (result !== undefined) {
            // null result
            if (!!result) {
                return result;
            }
            else {
                return;
            }
        }
    }
    var filePath = item.url;
    // Read from package
    fs.access({
        path: filePath,
        success: function () {
            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                nextPipe(item, callback);
            }
            else {
                readText(item, callback);
            }
        },
        fail: function (res) {
            readFromLocal(item, callback);
        }
    });
};

WXDownloader.prototype.cleanOldAssets = function () {
    fs.getSavedFileList({
        success: function (res) {
            var list = res.fileList;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var path = list[i].filePath;
                    fs.unlink({
                        filePath: list[i].filePath, 
                        success: function () {
                            cc.log('Removed local file ' + path + ' successfully!');
                        },
                        fail: function (res) {
                            cc.warn('Failed to remove file(' + path + '): ' + res ? res.errMsg : 'unknown error');
                        }
                    });
                }
            }
        },
        fail: function (res) {
            cc.warn('Failed to list all saved files: ' + res ? res.errMsg : 'unknown error');
        }
    });
};

WXDownloader.prototype.cleanAllAssets = function () {
    fs.getSavedFileList({
        success: function (res) {
            var list = res.fileList;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var path = list[i].filePath;
                    fs.unlink({
                        filePath: list[i].filePath, 
                        success: function () {
                            cc.log('Removed local file ' + path + ' successfully!');
                        },
                        fail: function (res) {
                            cc.warn('Failed to remove file(' + path + '): ' + res ? res.errMsg : 'unknown error');
                        }
                    });
                }
            }
        },
        fail: function (res) {
            cc.warn('Failed to list all saved files: ' + res ? res.errMsg : 'unknown error');
        }
    });
};

var wxDownloader = window.wxDownloader = new WXDownloader();

function nextPipe (item, callback) {
    var queue = cc.LoadingItems.getQueue(item);
    queue.addListener(item.id, function (item) {
        if (item.error) {
            fs.unlink({
                filePath: item.url, 
                success: function () {
                    cc.log('Load failed, removed local file ' + item.url + ' successfully!');
                }
            });
        }
    });
    callback(null, null);
}

function readText (item, callback) {
    var url = item.url;
    fs.readFile({
        filePath: url,
        encoding: 'utf8',
        success: function (res) {
            item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.COMPLETE;
            callback(null, res.data);
        },
        fail: function (res) {
            cc.warn('Read file failed: ' + url);
            fs.unlink({
                filePath: url, 
                success: function () {
                    cc.log('Read file failed, removed local file ' + url + ' successfully!');
                }
            });
            callback({
                status: 0, 
                errorMessage: res && res.errMsg ? res.errMsg : "Read text file failed: " + url
            });
        }
    });
}

function readFromLocal (item, callback) {
    var localPath = wx.env.USER_DATA_PATH + '/' + item.url;
    // Read from local file cache
    fs.access({
        path: localPath,
        success: function () {
            item.url = localPath;
            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                nextPipe(item, callback);
            }
            else {
                readText(item, callback);
            }
        },
        fail: function (res) {
            // No remote server indicated, then continue to downloader
            if (!wxDownloader.REMOTE_SERVER_ROOT) {
                callback(null, null);
                return;
            }

            downloadRemoteFile(item, callback);
        }
    });
}

function downloadRemoteFile (item, callback) {
    // Download from remote server
    var relatUrl = item.url;
    var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
    item.url = remoteUrl;
    wx.downloadFile({
        url: remoteUrl,
        success: function(res) {
            if (res.tempFilePath) {
                // Save to local path
                var localPath = wx.env.USER_DATA_PATH + '/' + relatUrl;
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    filePath: localPath,
                    success: function (res) {
                        cc.log('Write file to ' + res.savedFilePath + ' successfully!');
                        item.url = res.savedFilePath;
                        if (item.type && non_text_format.indexOf(item.type) !== -1) {
                            nextPipe(item, callback);
                        }
                        else {
                            readText(item, callback);
                        }
                    },
                    fail: function () {
                        // Failed to save file, then just use remote url
                        callback(null, null);
                    }
                });
            } else if (res.statusCode === 404) {
                cc.warn("Download file failed: " + remoteUrl);
                callback({
                    status: 0, 
                    errorMessage: res && res.errMsg ? res.errMsg : "Download file failed: " + remoteUrl
                });
            }
        },
        fail: function (res) {
            // Continue to try download with downloader, most probably will also fail
            callback(null, null);
        }
    })
}

// function downloadRemoteTextFile (item, callback) {
//     // Download from remote server
//     var relatUrl = item.url;
//     var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
//     item.url = remoteUrl;
//     wx.request({
//         url: remoteUrl,
//         success: function(res) {
//             if (res.data) {
//                 if (res.statusCode === 200 || res.statusCode === 0) {
//                     var data = res.data;
//                     item.states[cc.loader.downloader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                     if (data) {
//                         if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
//                             // Should we check if item.type is json ? If not, loader behavior could be different
//                             item.states[cc.loader.loader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                             callback(null, data);
//                             data = JSON.stringify(data);
//                         }
//                         else {
//                             callback(null, data);
//                         }
//                     }

//                     // Save to local path
//                     var localPath = wx.env.USER_DATA_PATH + '/' + relatUrl;
//                     // Should recursively mkdir first
//                     fs.writeFile({
//                         filePath: localPath,
//                         data: data,
//                         encoding: 'utf8',
//                         success: function (res) {
//                             cc.log('Write file to ' + res.savedFilePath + ' successfully!');
//                         },
//                         fail: function (res) {
//                             // undone implementation
//                         }
//                     });
//                 } else {
//                     cc.warn("Download text file failed: " + remoteUrl);
//                     callback({
//                         status:0, 
//                         errorMessage: res && res.errMsg ? res.errMsg : "Download text file failed: " + remoteUrl
//                     });
//                 }
//             }
//         },
//         fail: function (res) {
//             // Continue to try download with downloader, most probably will also fail
//             callback(null, null);
//         }
//     });
// }
