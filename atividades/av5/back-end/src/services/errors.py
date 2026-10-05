class ErroValidacao(Exception):
    def __init__(self, mensagem, campos=None):
        super().__init__(mensagem)
        self.mensagem = mensagem
        self.campos = campos or {}


class Conflito(Exception):
    pass