const { defineConfig } = require("cypress");
const { MemoryFS } = require("@parcel/fs");
const { Parcel, createWorkerFarm } = require("@parcel/core");

/**
 *
 * @param {Cypress.DevServerConfig} cypressConfig
 */
async function createParcelDevServer(cypressConfig) {
  // let workerFarm = createWorkerFarm();
  // let outputFS = new MemoryFS();

  const PORT = 1234;
  console.log("Create");

  let bundler = new Parcel({
    entries: cypressConfig.specs.map((x) => x.relative),
    defaultConfig: "@parcel/config-default",
    // outputFS,
    serveOptions: {
      port: PORT,
      publicUrl: "__cypress/src",
    },
    hmrOptions: {
      port: PORT,
    },
  });

  console.log(bundler);

  let { bundleGraph, buildTime } = await bundler.run();
  let bundles = bundleGraph.getBundles();
  console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
  // console.log({bundleGraph, bundles})
  bundles.forEach(async (b) => {
    // await outputFS.writeFile(b.filePath.replace('src', 'dist'), b.getMainEntry().getCode())
    // console.log('wrote', b.filePath.replace('src', 'dist'), b.getMainEntry()?.getCode())
    // console.log(b.id, b.name, b.displayName, b.filePath, b.getMainEntry()?.getCode());
    console.log("bundle", JSON.stringify(b, null, 2));
  });

  await bundler.watch();

  // await workerFarm.end()

  return {
    port: PORT,
    close: () => {},
  };
}

module.exports = defineConfig({
  component: {
    excludeSpecPattern: "dist/**/*",
    async devServer(cypressConfig) {
      // return devServer instance or a promise that resolves to
      // a dev server here
      const parcel = await createParcelDevServer(cypressConfig);

      return parcel;
    },
    indexHtmlFile: "./component-index.html",
  },
});
