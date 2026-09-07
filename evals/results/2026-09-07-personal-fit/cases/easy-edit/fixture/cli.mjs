const arg=process.argv[2];
if(arg==='--help') console.log('Upload thing\nUsage: upload <filename>');
else if(arg) console.log(`Uploaded ${arg}`);
else { console.error('A filename is required'); process.exitCode=1; }
