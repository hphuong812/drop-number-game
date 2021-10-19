class KeyBoard {
    constructor(value) {
        this.value = value;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;
        this.handle();

    }
    setPress(fn) {
        this.press = fn;
    }

    setRelease(fn) {
        this.release = fn;
    }
    handle() {
        window.addEventListener(
            "keydown", (event) => this.downListener(event), false
        );
        window.addEventListener(
            "keyup", (event) => this.upListener(event), false
        );
    }

    downListener(event) {
        if (event.key === this.value) {
            this.isDown = true;
            this.press();
        }
    }

    upListener(event) {
        if (event.key === this.value) {
            this.isDown = false;
            this.release();
        }
    }

    unsubscribe() {
        window.removeEventListener("keydown", this.downListener);
        window.removeEventListener("keyup", this.upListener);
    }


}
export { KeyBoard }