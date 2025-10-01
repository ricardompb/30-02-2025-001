import { cpf } from 'cpf-cnpj-validator';

function checkCPF(cpfNumber) {
    return cpf.isValid(cpfNumber);
}

export default {
    checkCPF
}