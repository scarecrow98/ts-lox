export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

  // One or two character tokens.
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,

  // Literals.
  IDENTIFIER, STRING, NUMBER, COMMENT,

  // Keywords.
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
}

export type Token = {
  /**
   * Type of the token
   */
  type: TokenType,

  /**
   * The actual string from the source code
   */
  lexeme: string,

  /**
   * The converted value of the token, if it's a literal, eg. 14.5 (as a number)
   */
  literal: any,

  /**
   * In which line the token can be found
   */
  line: number
}

export const formatToken = (token: Token) => {
  let literal: unknown;

  if (typeof token.literal === 'number') {
    literal = token.literal + '';
  } else if (typeof token.literal === 'string') {
    literal = '"' + token.literal?.replace(/\r\n/, '\\r\\n') + '"';
  } else {
    literal = token.lexeme;
  }

  return {
    type: TokenType[token.type],
    value: literal
  };
}