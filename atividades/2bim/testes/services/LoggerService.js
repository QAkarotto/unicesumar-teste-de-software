class LoggerService {
  static registrarLog(mensagem) {
    console.log(`\[LOG AUDITORIA]: ${mensagem}`);
  }
}

module.exports = LoggerService;