const { execSync } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";
const pluginPath = isWindows
  ? path.resolve("node_modules", ".bin", "protoc-gen-ts_proto.cmd")
  : path.resolve("node_modules", ".bin", "protoc-gen-ts_proto");

const command = `protoc \
  --plugin=protoc-gen-ts_proto="${pluginPath}" \
  --ts_proto_out=./src/grpc \
  --ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions,useExactTypes=false,forceLong=string \
  --proto_path=. service.proto`;

execSync(command, { stdio: "inherit", shell: true });
