# GitHub DevRadar

O **GitHub DevRadar** é um painel dinâmico e moderno construído em React para monitoramento e análise visual de perfis e organizações do GitHub. O sistema consome a API oficial do GitHub em tempo real para gerar métricas de saúde dos repositórios e um mix visual das principais tecnologias utilizadas.

---

## Visualize Online

O projeto está hospedado e disponível para testes na nuvem através do link:
**https://github-devradar-react.vercel.app/**

---

## Tecnologias

O ecossistema do projeto foi selecionado utilizando as ferramentas mais modernas e eficientes do mercado atual:

* **React (v19+)**: Biblioteca declarativa para construção de interfaces reativas e componentizadas.
* **Vite**: Ferramenta de build e bundling ultrarápida (substituta do antigo *Create React App*).
* **Tailwind CSS (v4.3+)**: Nova versão do framework CSS, utilizando o motor Oxide nativo e configurações via variáveis de ambiente CSS.
* **Recharts**: Biblioteca de gráficos baseada em componentes React para visualização de dados nativos.
* **Lucide React**: Conjunto de ícones vetoriais modernos e leves.
* **Node.js & npm**: Ambiente de execução e gerenciamento de pacotes do ecossistema JavaScript.
* **Docker**: Containerização completa da aplicação para ambientes de produção.

---

## Arquitetura e Recursos do Sistema

Diferente de um CRUD tradicional, este projeto foca em conceitos avançados de engenharia de frontend:
1.  **Consumo Assíncrono de API**: Tratamento de requisições paralelas e encadeadas usando `async/await`.
2.  **Gerenciamento de Estados Complexos**: Controle de fluxo de estados para *Loading* (carregamento), *Error Handling* (tratamento de erros de chamadas/erros de digitação) e *Data Presentation*.
3.  **Processamento de Dados Dinâmicos**: Algoritmo que intercepta a carga de dados brutos da API do GitHub e calcula o percentual de linguagens para alimentar o gráfico em tempo de execução.
4.  **CI/CD Automatizado**: Integração contínua via GitHub conectado à Vercel (cada *push* na branch `main` atualiza a produção automaticamente).

Resumidamente:

* Ele lida com chamadas de rede assíncronas usando async/await dentro de uma arquitetura de eventos disparados por formulário.
* Implementa estados de Carregamento (loading) e Erro (error), evitando telas travadas ou quebras de UI quando o dado falha.
* Trata os dados brutos da API em tempo de execução (getLanguageData()) para alimentar um componente gráfico interativo (Recharts).

---

## Como Executar o Projeto

Você pode rodar este projeto localmente de duas formas: no ambiente de desenvolvimento ou de forma isolada em um container Docker.

### Opção 1: Ambiente Local (Desenvolvimento)

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. Clone o repositório:
   ```bash
   git clone https://github.com/willianferreirafg/github-devradar-react.git
   cd github-devradar

2. Instale as dependências listadas no **`package.json`**:
   ```bash
   npm install
   
3. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev

4. Abra **`http://localhost:5173`** no seu navegador.

### Opção 2: Via Docker (Ambiente de Produção)

Quanto ao Docker, o projeto conta com um **Dockerfile multi-stage** — isto é, vários estágios dentro de um único arquivo para gerar a imagem (container).

* O primeiro estágio é a compilação da aplicação gerando os arquivos estáticos de produção (**`dist`**).
* O segundo estágio é a utilização de uma imagem aplina do Nginx para servir os arquivos (do 1º estágio) na porta 80.

1. Construa a imagem Docker:
   ```bash
   docker build -t github-devradar:v1 .

2. Execute o container mapeando para a porta 8080:
   ```bash
   docker run -d -p 8080:80 --name radar-app github-devradar:v1

3. Abra **`http://localhost:8080`** no seu navegador.

**ATENÇÃO** para essa questão da porta 8080. Se você tiver outros projetos em seu computador, principalmente Web, envolvendo APIs ou usos de frameworks como o próprio React/TypeScript/Angular, ela pode já estar em uso e, desse modo, terá de trocar para uma outra porta para que consiga rodar.

---

## Autor

Willian Ferreira Gonçalves



