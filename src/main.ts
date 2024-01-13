import { readFileSync } from "fs";
import { Lexer, tokenToString } from "./lexing";

const content = readFileSync('./test/test.lox', 'utf-8').toString();

const lexer = new Lexer(content);

const tokens = lexer.scan();

console.log('===========================================');

tokens.forEach(token => {
  console.log(tokenToString(token));
});