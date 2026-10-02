#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {createConnection} from "node:net";
const [action,artifact,destination]=process.argv.slice(2);
const state=JSON.parse(readFileSync(new URL("state.json",import.meta.url),"utf8"));
const socket=createConnection(process.env.SIMPLE_ACTION_SOCKET);
socket.on("connect",()=>socket.write(JSON.stringify({action:action??null,artifact:artifact??null,destination:destination??null,phase:state.phase,scriptPid:process.pid})+"\n"));
let reply="";
socket.on("data",chunk=>reply+=chunk);
socket.on("end",()=>{ console.log(reply.trim()); const result=JSON.parse(reply); if(!result.recorded)process.exitCode=1; });
socket.on("error",error=>{console.error(error.message);process.exitCode=2;});
