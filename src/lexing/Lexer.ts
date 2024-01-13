import { Logger } from "../logging/Logger";
import { Token, TokenType } from "./Token";

const KEYWORDS: Record<string, TokenType> = {
  'and':      TokenType.AND,
  'class':    TokenType.CLASS,
  'else':     TokenType.ELSE,
  'false':    TokenType.FALSE,
  'for':      TokenType.FOR,
  'fun':      TokenType.FUN,
  'if':       TokenType.IF,
  'nil':      TokenType.NIL,
  'or':       TokenType.OR,
  'print':    TokenType.PRINT,
  'return':   TokenType.RETURN,
  'super':    TokenType.SUPER,
  'this':     TokenType.THIS,
  'true':     TokenType.TRUE,
  'var':      TokenType.VAR,
  'while':    TokenType.WHILE,
};

export class Lexer {

  private logger = new Logger();

  /**
   * List of tokens already processed
   */
  private tokens: Array<Token> = [];

  /**
   * Pointing to the current charater being examined
   */
  private current: number = 0;

  /**
   * The index pointing to the first charater of the token begin scanned
   */
  private start: number = 0;

  /**
   * Which line we are on currently in the tokenizin process
   */
  private line: number = 1;

  constructor(
    private input: string
  ) {

  }

  scan(): Array<Token> {

    while (!this.isAtEnd()) {
      this.start = this.current;

      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      lexeme: '',
      literal: null,
      line: this.line
    });
    return this.tokens;
  }

  private scanToken() {
    const char = this.advance();

    switch (char) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break;
      case '/':
        if (this.match('/')) {
          // comment spans the whole line
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\t':
      case '\r':
        // skip whitespace characters
        break;
      case '\n':
        // increment line counter on every newline character
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          this.logger.reportError(`Unrecognized character "${char}"`, this.line);
        }
    }
  }

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      this.logger.reportError('Unterminated string literal', this.line);
      return;
    }

    // eat the closing "
    this.advance();

    const value = this.input.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number() {
    while(this.isDigit(this.peek())) {
      this.advance();
    }

    // search for decimal point and then the fractional part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // eat the "."
      this.advance();

      // consume the fractional part
      while(this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(TokenType.NUMBER, parseFloat(this.input.substring(this.start, this.current)));
  }

  private identifier() {
    while(this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const value = this.input.substring(this.start, this.current);
    let tokenType = KEYWORDS[value];

    if (!tokenType) {
      tokenType = TokenType.IDENTIFIER
    }
    this.addToken(tokenType);
  }

  private isDigit(char: string): boolean {
    return /[\d]/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[A-Za-z]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return /[A-Za-z\d]/.test(char);
  }

  private isAtEnd(): boolean {
    return this.current >= this.input.length;
  }

  private advance(): string {
    return this.input.charAt(this.current++);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    
    if (this.input.charAt(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) {
      return '\0';
    }

    return this.input.charAt(this.current);
  }

  private peekNext() {
    if (this.current + 1 >= this.input.length) {
      return '\0';
    }

    return this.input.charAt(this.current + 1);
  }

  private addToken(type: TokenType, literal: string | number | null = null) {
    const lexeme = this.input.substring(this.start, this.current);
    this.tokens.push({
      type,
      literal,
      line: this.line,
      lexeme
    });
  }
}