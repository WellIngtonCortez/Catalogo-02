/**
 * Utilitários para formatação e processamento de preços/moedas
 */

/**
 * Formata um número para o padrão de moeda brasileiro (BRL)
 * Ex: 2900.5 -> R$ 2.900,50
 */
export const formatPrice = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  
  const number = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(number)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

/**
 * Converte uma string de preço (com ou sem símbolos) para um número válido
 * Lida com separadores de milhar (ponto) e decimal (vírgula) do padrão brasileiro
 */
export const parsePrice = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  
  // Limpar símbolos e espaços
  let cleanValue = value.toString()
    .replace('R$', '')
    .replace(/\s/g, '');

  // Se o valor já for um número válido no formato JS (ex: "79.11"), 
  // e não contiver vírgula, podemos dar parse diretamente.
  // Isso evita que o ponto decimal do HTML5 input type="number" seja removido.
  if (cleanValue.includes(',') ) {
    // Se tem vírgula, tratamos como formato brasileiro (1.234,56)
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  }
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};
