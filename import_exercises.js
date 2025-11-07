// Script para importar exercícios da lista PDF
const exercises = [
  // Peito
  { nome: 'Supino reto', grupo_muscular: 'Peito', series: 4, reps: 8, observacao: 'Peito (livre)' },
  { nome: 'Supino inclinado', grupo_muscular: 'Peito', series: 4, reps: 8, observacao: 'Peito (livre)' },
  { nome: 'Supino declinado', grupo_muscular: 'Peito', series: 4, reps: 8, observacao: 'Peito (livre)' },
  { nome: 'Crossover', grupo_muscular: 'Peito', series: 3, reps: 12, observacao: 'Peito (máquina)' },
  { nome: 'Peck deck', grupo_muscular: 'Peito', series: 3, reps: 12, observacao: 'Peito (máquina)' },
  { nome: 'Crucifixo reto', grupo_muscular: 'Peito', series: 3, reps: 10, observacao: 'Peito (livre)' },
  { nome: 'Crucifixo inclinado', grupo_muscular: 'Peito', series: 3, reps: 10, observacao: 'Peito (livre)' },
  { nome: 'Flexão de braço', grupo_muscular: 'Peito', series: 3, reps: 12, observacao: 'Peito (livre)' },
  { nome: 'Supino com halteres', grupo_muscular: 'Peito', series: 4, reps: 8, observacao: 'Peito (livre)' },
  { nome: 'Supino na máquina', grupo_muscular: 'Peito', series: 3, reps: 12, observacao: 'Peito (máquina)' },

  // Costas
  { nome: 'Puxada frente', grupo_muscular: 'Costas', series: 4, reps: 8, observacao: 'Costas (máquina)' },
  { nome: 'Puxada atrás', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (máquina)' },
  { nome: 'Remada curvada', grupo_muscular: 'Costas', series: 4, reps: 8, observacao: 'Costas (livre)' },
  { nome: 'Remada baixa', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (máquina)' },
  { nome: 'Remada unilateral com halter', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (livre)' },
  { nome: 'Puxada neutra', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (máquina)' },
  { nome: 'Barra fixa', grupo_muscular: 'Costas', series: 3, reps: 8, observacao: 'Costas (livre)' },
  { nome: 'Remada cavalinho', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (livre)' },
  { nome: 'Remada sentada', grupo_muscular: 'Costas', series: 3, reps: 10, observacao: 'Costas (máquina)' },
  { nome: 'Levantamento terra', grupo_muscular: 'Costas', series: 3, reps: 6, observacao: 'Costas (livre)' },

  // Ombros
  { nome: 'Desenvolvimento com halteres', grupo_muscular: 'Ombros', series: 4, reps: 8, observacao: 'Ombros (livre)' },
  { nome: 'Desenvolvimento na máquina', grupo_muscular: 'Ombros', series: 3, reps: 10, observacao: 'Ombros (máquina)' },
  { nome: 'Elevação lateral', grupo_muscular: 'Ombros', series: 3, reps: 12, observacao: 'Ombros (livre)' },
  { nome: 'Elevação frontal', grupo_muscular: 'Ombros', series: 3, reps: 12, observacao: 'Ombros (livre)' },
  { nome: 'Remada alta', grupo_muscular: 'Ombros', series: 3, reps: 10, observacao: 'Ombros (livre)' },
  { nome: 'Crucifixo inverso', grupo_muscular: 'Ombros', series: 3, reps: 12, observacao: 'Ombros (livre)' },
  { nome: 'Desenvolvimento militar', grupo_muscular: 'Ombros', series: 3, reps: 8, observacao: 'Ombros (livre)' },
  { nome: 'Elevação lateral na máquina', grupo_muscular: 'Ombros', series: 3, reps: 12, observacao: 'Ombros (máquina)' },
  { nome: 'Arnold press', grupo_muscular: 'Ombros', series: 3, reps: 10, observacao: 'Ombros (livre)' },
  { nome: 'Face pull', grupo_muscular: 'Ombros', series: 3, reps: 12, observacao: 'Ombros (máquina)' },

  // Bíceps
  { nome: 'Rosca direta', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca alternada', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca concentrada', grupo_muscular: 'Bíceps', series: 3, reps: 12, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca scott', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (máquina)' },
  { nome: 'Rosca martelo', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca inversa', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca no cabo', grupo_muscular: 'Bíceps', series: 3, reps: 12, observacao: 'Bíceps (máquina)' },
  { nome: 'Rosca 21', grupo_muscular: 'Bíceps', series: 3, reps: 21, observacao: 'Bíceps (livre)' },
  { nome: 'Rosca com corda', grupo_muscular: 'Bíceps', series: 3, reps: 12, observacao: 'Bíceps (máquina)' },
  { nome: 'Rosca spider', grupo_muscular: 'Bíceps', series: 3, reps: 10, observacao: 'Bíceps (livre)' },

  // Tríceps
  { nome: 'Tríceps testa', grupo_muscular: 'Tríceps', series: 3, reps: 10, observacao: 'Tríceps (livre)' },
  { nome: 'Tríceps corda', grupo_muscular: 'Tríceps', series: 3, reps: 12, observacao: 'Tríceps (máquina)' },
  { nome: 'Tríceps banco', grupo_muscular: 'Tríceps', series: 3, reps: 10, observacao: 'Tríceps (livre)' },
  { nome: 'Tríceps francês', grupo_muscular: 'Tríceps', series: 3, reps: 10, observacao: 'Tríceps (livre)' },
  { nome: 'Tríceps pulley', grupo_muscular: 'Tríceps', series: 3, reps: 12, observacao: 'Tríceps (máquina)' },
  { nome: 'Tríceps coice', grupo_muscular: 'Tríceps', series: 3, reps: 12, observacao: 'Tríceps (livre)' },
  { nome: 'Tríceps na máquina', grupo_muscular: 'Tríceps', series: 3, reps: 12, observacao: 'Tríceps (máquina)' },
  { nome: 'Mergulho nas paralelas', grupo_muscular: 'Tríceps', series: 3, reps: 8, observacao: 'Tríceps (livre)' },
  { nome: 'Tríceps invertido', grupo_muscular: 'Tríceps', series: 3, reps: 10, observacao: 'Tríceps (máquina)' },
  { nome: 'Tríceps unilateral', grupo_muscular: 'Tríceps', series: 3, reps: 10, observacao: 'Tríceps (máquina)' },

  // Pernas
  { nome: 'Agachamento livre', grupo_muscular: 'Pernas', series: 4, reps: 8, observacao: 'Pernas (livre)' },
  { nome: 'Agachamento smith', grupo_muscular: 'Pernas', series: 3, reps: 10, observacao: 'Pernas (máquina)' },
  { nome: 'Leg press', grupo_muscular: 'Pernas', series: 4, reps: 8, observacao: 'Pernas (máquina)' },
  { nome: 'Cadeira extensora', grupo_muscular: 'Pernas', series: 3, reps: 12, observacao: 'Pernas (máquina)' },
  { nome: 'Cadeira flexora', grupo_muscular: 'Pernas', series: 3, reps: 12, observacao: 'Pernas (máquina)' },
  { nome: 'Cadeira adutora', grupo_muscular: 'Pernas', series: 3, reps: 12, observacao: 'Pernas (máquina)' },
  { nome: 'Cadeira abdutora', grupo_muscular: 'Pernas', series: 3, reps: 12, observacao: 'Pernas (máquina)' },
  { nome: 'Avanço com halteres', grupo_muscular: 'Pernas', series: 3, reps: 10, observacao: 'Pernas (livre)' },
  { nome: 'Agachamento sumó', grupo_muscular: 'Pernas', series: 3, reps: 10, observacao: 'Pernas (livre)' },
  { nome: 'Agachamento búlgaro', grupo_muscular: 'Pernas', series: 3, reps: 10, observacao: 'Pernas (livre)' },

  // Glúteos (novo grupo)
  { nome: 'Elevação de quadril', grupo_muscular: 'Glúteos', series: 3, reps: 12, observacao: 'Glúteos (livre)' },
  { nome: 'Glúteo 4 apoios', grupo_muscular: 'Glúteos', series: 3, reps: 12, observacao: 'Glúteos (máquina)' },
  { nome: 'Cadeira abdutora', grupo_muscular: 'Glúteos', series: 3, reps: 12, observacao: 'Glúteos (máquina)' },
  { nome: 'Agachamento profundo', grupo_muscular: 'Glúteos', series: 3, reps: 10, observacao: 'Glúteos (livre)' },
  { nome: 'Passada lateral', grupo_muscular: 'Glúteos', series: 3, reps: 10, observacao: 'Glúteos (livre)' },
  { nome: 'Step-up', grupo_muscular: 'Glúteos', series: 3, reps: 10, observacao: 'Glúteos (livre)' },
  { nome: 'Glúteo na polia', grupo_muscular: 'Glúteos', series: 3, reps: 12, observacao: 'Glúteos (máquina)' },
  { nome: 'Ponte com barra', grupo_muscular: 'Glúteos', series: 3, reps: 10, observacao: 'Glúteos (livre)' },

  // Abdômen
  { nome: 'Abdominal reto', grupo_muscular: 'Abdômen', series: 3, reps: 15, observacao: 'Abdômen (livre)' },
  { nome: 'Abdominal infra', grupo_muscular: 'Abdômen', series: 3, reps: 15, observacao: 'Abdômen (livre)' },
  { nome: 'Prancha', grupo_muscular: 'Abdômen', series: 3, reps: 30, observacao: 'Abdômen (livre)' },
  { nome: 'Abdominal lateral', grupo_muscular: 'Abdômen', series: 3, reps: 15, observacao: 'Abdômen (livre)' },
  { nome: 'Abdominal na bola', grupo_muscular: 'Abdômen', series: 3, reps: 15, observacao: 'Abdômen (livre)' },
  { nome: 'Abdominal na máquina', grupo_muscular: 'Abdômen', series: 3, reps: 15, observacao: 'Abdômen (máquina)' },
  { nome: 'Glúteo kickback', grupo_muscular: 'Abdômen', series: 3, reps: 12, observacao: 'Abdômen (máquina)' },
  { nome: 'Agachamento sumó com halter', grupo_muscular: 'Abdômen', series: 3, reps: 12, observacao: 'Abdômen (livre)' },
];

console.log(`Total de ${exercises.length} exercícios para importar`);
console.log(JSON.stringify(exercises, null, 2));

