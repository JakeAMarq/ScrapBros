/**
 * Asset manager class for loading images from files
 */
class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    }

    /**
     * Pushes image file at path onto downloadQueue
     * @param {String} path
     */
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    }

    /**
     * Returns true if all image files in downloadQueue have either been successfully loaded into cache
     * or thrown an
     * @returns {boolean}
     */
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    }

    /**
     * Attempts to load every file in downloadQueue into cache as Image object, then executes callback
     * @callback callback
     */
    downloadAll(callback) {
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const img = new Image();
            const that = this;
            const path = this.downloadQueue[i];
            console.log(path);
            img.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if (that.isDone())
                    callback();
            });
            img.addEventListener("error", function () {
                console.log("Error loading " + this.src);
                that.errorCount++;
                if (that.isDone())
                    callback();
            });
            img.src = path;
            this.cache[path] = img;
        }
    }

    /**
     * Returns image object corresponding to path or undefined if not in cache
     * @param {String} path
     * @returns {Image | undefined}
     */
    getAsset(path) {
        return this.cache[path];
    }
}




