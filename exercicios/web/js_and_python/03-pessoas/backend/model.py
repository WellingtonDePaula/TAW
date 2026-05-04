# definição da classe
class Pessoa:
    def __init__(self, nome, email, telefone):
        self.nome = nome
        self.email = email
        self.telefone = telefone

    def __str__(self):
        return f'''Olá, meu nome é {self.nome}, 
        meu email é {self.email} e 
        meu telefone é {self.telefone}.'''
    
    def to_dict(self):
        return {
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone
        }
    
# teste da classe
if __name__ == "__main__":
    pessoa1 = Pessoa("João", "jo@gmail.com", "912345678")
    print(pessoa1)