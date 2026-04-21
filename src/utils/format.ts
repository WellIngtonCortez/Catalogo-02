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
  
  // Se for string, limpar formatação brasileira
  // Remove R$, espaços e pontos de milhar
  // Substitui a vírgula decimal por ponto
  const cleanValue = value
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '') // Remove separador de milhar
    .replace(',', '.'); // Converte decimal para padrão JS
    
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};
