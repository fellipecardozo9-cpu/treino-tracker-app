# Treino Tracker - TODO

## Funcionalidades Principais

- [x] Página inicial com seleção de dia de treino
- [x] Visualização dos exercícios do dia selecionado
- [x] Sistema de marcação de séries concluídas
- [x] Registro de peso/carga utilizada por exercício
- [x] Registro de repetições realizadas
- [x] Armazenamento local dos dados (localStorage)
- [x] Histórico de treinos realizados
- [x] Gráficos de evolução de carga por exercício
- [x] Gráficos de evolução de volume total (séries x reps)
- [x] Página de estatísticas e progresso
- [x] Design responsivo para celular
- [ ] Tema dark/light (opcional)
- [ ] Exportação de dados (CSV/PDF)

## Componentes a Criar

- [x] DaySelector - Seleção do dia de treino (Home.tsx)
- [x] ExerciseCard - Card individual de exercício (WorkoutDay.tsx)
- [x] SetTracker - Rastreador de séries
- [x] WeightInput - Input para peso/carga (SetTracker.tsx)
- [x] ProgressChart - Gráfico de evolução (ProgressChart.tsx)
- [x] HistoryView - Visualização do histórico (Statistics.tsx)
- [x] StatisticsPage - Página de estatísticas

## Integração de Dados

- [x] Integrar dados do JSON do treino
- [x] Implementar localStorage para persistência
- [x] Criar hooks customizados para gerenciar estado

## Testes e Deploy

- [x] Adicionar gráficos com Recharts
- [ ] Testar responsividade no celular
- [ ] Testar armazenamento e recuperação de dados
- [x] Criar checkpoint
- [ ] Deploy da aplicação



## Novas Funcionalidades Solicitadas

- [x] Adicionar indicador visual de semanas (1/8, 2/8, etc.) na página inicial
- [x] Mostrar semana atual baseada no número de sessões de cada dia
- [x] Indicador visual de progresso das 8 semanas (barra ou badges)



## Funcionalidade: Finalizar Treino e Reset de Semana

- [x] Adicionar botão "Finalizar Treino" na página do dia
- [x] Ao clicar, validar se todos os exercícios foram completados
- [x] Gerar registro de conclusão da semana (data + semana completa)
- [x] Armazenar histórico de semanas completadas
- [x] Reset automático dos dados do dia para começar a próxima semana
- [x] Mostrar confirmação visual de semana concluída
- [x] Atualizar contador de semana na página inicial



## Funcionalidade: Banco de Dados de Exercícios

- [x] Criar banco de dados local de exercícios
- [x] Organizar exercícios por grupos musculares
- [x] Interface CRUD para exercícios (criar, editar, deletar)
- [x] Sistema de seleção e troca de exercícios nos treinos
- [x] Interface para editar treinos (Segunda, Terça, etc.)
- [x] Criar múltiplos treinos e alternar entre eles
- [x] Sincronização de dados de progresso ao trocar exercícios
- [x] Página de gerenciamento de exercícios
- [x] Página de gerenciamento de treinos



## Funcionalidade: Reset de Progresso

- [x] Criar botão de reset de progresso por dia
- [x] Dialog de confirmação para evitar deletar por acidente
- [x] Limpar histórico de sessões do dia selecionado
- [x] Manter histórico de semanas completadas
- [x] Botão acessível na página do dia de treino



## Bugs Reportados

- [x] Header está tampando o primeiro exercício (z-index issue) - CORRIGIDO
- [x] Espaçamento corrigido para evitar sobreposição
- [x] Botão flutuante de finalizar está tampando exercícios da parte de baixo - CORRIGIDO



## Novas Funcionalidades Solicitadas

- [x] Expandir gerenciador de treinos para segunda a domingo (7 dias)
- [x] Interface de edição de treinos para cada dia da semana
- [x] Adicionar opção de criar exercícios manualmente no banco de dados
- [x] Dialog/modal para criar novo exercício
- [x] Campos: nome, séries, reps, grupo muscular, observação



## Bugs a Corrigir

- [x] ExerciseManager: Erro do Select com value vazio (Select.Item value prop) - CORRIGIDO



## Funcionalidade: Importar Lista de Exercícios

- [x] Adicionar 76 exercícios da lista fornecida ao banco de dados
- [x] Criar novos grupos musculares: Glúteos
- [x] Acrescentar exercícios aos grupos existentes
- [x] Validar duplicatas antes de adicionar




## Funcionalidade: Autenticação e Branding

- [x] Logo Everstrong adicionada
- [x] Tela de login implementada
- [x] 3 tipos de usuários (Admin, Personal, Aluno)
- [x] Botão de logout
- [x] Proteção de rotas
- [ ] Cronômetro de descanso (60s/90s) - EM DESENVOLVIMENTO
- [ ] Melhorar histórico para não apagar dados - EM DESENVOLVIMENTO

## Bugs Reportados - Autenticação e Exercícios

- [x] Logout automático ao fazer login (investigar ProtectedRoute) - CORRIGIDO
- [x] Adicionar todos os 76 exercícios do banco de dados na seleção de treinos - JA ESTAVA IMPLEMENTADO
- [x] Integrar exercícios do banco com o gerenciador de treinos - JA ESTAVA IMPLEMENTADO

## Melhorias Solicitadas

- [ ] Mostrar todos os 76 exercícios do banco na janela de Gerenciar Treinos
- [ ] Filtrar exercícios por grupo muscular na seleção
- [ ] Melhorar interface de seleção de exercícios

## Funcionalidade: Sistema Robusto de Histórico

- [x] Criar tipos para treinos_concluidos (usuario_id, semana, dia, data, status, progresso)
- [x] Implementar hook useWorkoutHistory para persistência
- [x] Refatorar Finalizar Treino para salvar em histórico
- [x] Avançar automaticamente para próxima semana
- [ ] Carregar progresso salvo ao abrir a tela
- [ ] Travar semanas concluídas (não permitir reset)
- [ ] Mostrar histórico de semanas completadas
- [ ] Testar fluxo completo de 8 semanas



## Reestruturação Completa do Aplicativo

- [x] Refatorar Home para mostrar números 1-8 clicáveis por dia
- [x] Congelar dias - só abrir pelo número
- [x] Corrigir sistema de semanas para começar em 0/8
- [ ] Criar página de Treino com edição inline (nome, séries, reps, observação)
- [ ] Implementar mensagem "Treino Vencido" ao atingir 8/8
- [ ] Testar fluxo completo

## Funcionalidade: PWA e Icone

- [x] Converter aplicativo para PWA
- [x] Adicionar manifest.json
- [x] Adicionar logo Everstrong como icone do app
- [x] Permitir instalacao no celular
- [x] Funcionar offline




## Bug Reportado - Semana não avança

- [x] Semana fica em 1/8 mesmo após finalizar o treino - CORRIGIDO
- [x] Deve começar em 0/8 e avançar para 1/8 ao finalizar - CORRIGIDO
- [x] getCurrentWeekForDay deve retornar 0 inicialmente - CORRIGIDO
- [x] advanceWeekForDay deve incrementar de 0 para 1 - CORRIGIDO

