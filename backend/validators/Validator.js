export class InputValidator {
    static checkIfFieldIsEmpty(value, fieldname) {
        if (!value) { throw { status: 400, msg: `Campo ${fieldname} está vazio` }; }
    }
    static hasNoNumbers(value, fieldname) {
        if (/\d/.test(value)) {
            throw { status: 400, msg: `Campo ${fieldname} não pode conter números` };
        }
    }
    static throwIfFalse(value, msg) {
        if (!value || value === 0) {
            throw { status: 400, msg: `Valor ${msg} false` };
        }
    }
    static throwIfTrue(value, msg) {
        if (value) {
            throw { status: 400, msg: `Valor ${msg} true` };
        }
    }
    static hasLetters(value, fieldname) {
        if (/[a-zA-Z]/.test(value)) {
            throw { status: 400, msg: `Campo ${fieldname} não pode conter letras` };
        }
    }
}