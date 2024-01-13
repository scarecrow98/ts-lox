import { readFileSync } from "fs";
import { Lexer, formatToken } from "./lexing";

const content = readFileSync('./test/test.lox', 'utf-8').toString();

const lexer = new Lexer(content);

const tokens = lexer.scan();

console.log('===========================================');

console.table(
  tokens.map(token => formatToken(token))
);