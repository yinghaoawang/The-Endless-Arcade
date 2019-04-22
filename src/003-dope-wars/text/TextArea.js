import Text from './Text';

export default class TextArea extends Text {
    constructor(scene, x, y, width, maxLines, text) {
        super(scene, x, y, text);
        this.setWordWrapWidth(width);
        this.setMaxLines(maxLines);
    }
}