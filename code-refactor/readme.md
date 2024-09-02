# README - Refatoração do Serviço de Produtos

## Visão Geral

Este documento descreve as mudanças realizadas na refatoração do serviço de produtos, que foi originalmente implementado de forma monolítica e com código acoplado. A refatoração teve como objetivo melhorar a manutenibilidade, performance, e a organização do código, seguindo boas práticas de arquitetura e design, como a separação de responsabilidades, a implementação de validações robustas, e a otimização de recursos.

## Objetivos da Refatoração

1. **Separação de Responsabilidades**:
   - **Antes**: O `ProductService` era responsável por todas as operações de criação, leitura, atualização e exclusão (CRUD) diretamente, além de manipular transações de banco de dados e validações.
   - **Depois**: O código foi modularizado em componentes separados, incluindo `ProductRepository`, `ProductAssembler`, e `ProductService`, cada um com uma responsabilidade clara.

2. **Validações Robustas com Melhoria de Desempenho**:
   - **Antes**: As validações eram realizadas diretamente no serviço, utilizando verificações simples, o que aumentava a carga de trabalho no `ProductService` e reduzia a eficiência.
   - **Depois**: Implementamos um pipeline de validação utilizando `Ajv` como um `Pipe` e `Interceptor` do NestJS. Isso não apenas melhora a robustez das validações, mas também otimiza o consumo de CPU e memória. 
     - **Benefício de Desempenho**: O `Ajv` compila os esquemas de validação em código altamente otimizado, reduzindo o tempo de execução das validações. Além disso, movendo a validação para um interceptor, evitamos a execução de lógica de serviço dispendiosa para requisições que não passam pelas validações, resultando em menor uso de CPU e memória.

3. **Manejo de Erros Melhorado**:
   - **Antes**: As exceções eram lançadas diretamente dentro dos métodos do serviço, sem um padrão claro para mensagens de erro ou códigos de status.
   - **Depois**: Foi criada uma classe `CustomHttpException` para padronizar as mensagens de erro, códigos de status HTTP, e fornecer detalhes adicionais como timestamps e códigos específicos de erro.

4. **Padrões de Projeto Aplicados**:
   - **Assembler Pattern**: Implementado através do `ProductAssembler`, responsável por converter `DTOs` em entidades de domínio e vice-versa.
   - **Repository Pattern**: O `ProductRepository` agora lida com toda a comunicação com o banco de dados, isolando essa lógica das demais camadas.

5. **Gerenciamento de Transações**:
   - **Antes**: A transação era gerenciada diretamente dentro do serviço, o que criava acoplamento.
   - **Depois**: O gerenciamento de transações foi delegado ao `ProductRepository`, utilizando sessions do Mongoose para garantir consistência nas operações.

## Benefícios de Desempenho

- **Melhoria no Consumo de CPU**:
  - **Ajv como Interceptor**: Ao mover a validação para um interceptor e utilizar o `Ajv`, a CPU não é sobrecarregada com validações repetitivas ou redundantes. O `Ajv` gera código de validação otimizado, que é executado de forma eficiente, economizando ciclos de CPU.
  
- **Redução no Uso de Memória**:
  - **Pipelines de Validação**: Ao realizar validações antes de acessar o serviço, evitamos o carregamento desnecessário de objetos grandes ou processos pesados na memória, o que resulta em menor uso de memória.
  
- **Evitando Processamento Desnecessário**:
  - **Interceptores**: O uso de interceptores para validação permite que apenas as requisições válidas prossigam para o serviço, evitando o processamento desnecessário de dados inválidos, o que economiza tanto CPU quanto memória.

## Estrutura do Projeto Pós-Refatoração

- **src**
  - **controllers**
    - `product.controller.ts`: Controla as rotas e a entrada de dados.
  - **services**
    - `product.service.ts`: Lógica de negócio principal para produtos.
  - **repositories**
    - `product.repository.ts`: Lida com operações de banco de dados.
  - **assemblers**
    - `product.assembler.ts`: Converte entre DTOs e modelos de domínio.
  - **pipes**
    - `ajv-validation.pipe.ts`: Realiza a validação dos dados de entrada utilizando AJV.
  - **interceptors**
    - `ajv-validation.interceptor.ts`: Intercepta as requisições para validar dados antes do processamento.
  - **models**
    - `product.model.ts`: Define o esquema Mongoose para o produto.
  - **dto**
    - `product.dto.ts`: Contém os DTOs para criação e atualização de produtos.

## Conclusão

A refatoração do serviço de produtos não apenas melhora a organização e a manutenibilidade do código, mas também otimiza o consumo de recursos, como CPU e memória, através do uso eficaz de validações otimizadas com `Ajv` e a aplicação de interceptores. Estas mudanças resultam em um sistema mais robusto, escalável, eficiente e preparado para crescer conforme as necessidades do negócio aumentam.
