const { Transformer } = require("@parcel/plugin");
const fs = require("fs/promises");
const path = require("path");

module.exports = new Transformer({
  async transform({ asset }) {
    console.log(asset.id, asset.filePath, asset.getDependencies());
    if (!asset.filePath.endsWith(".cy.jsx")) {
      console.log(`not transforming ${asset.filePath}`, asset);
      return [asset];
    }

    console.log(`transforming, ${asset.filePath}`)


    // Retrieve the asset's source code and source map.
    let source = await asset.getCode();

    const loader = await fs.readFile(
      path.join(__dirname, "initCypressTests.js"),
      "utf-8"
    );
    let indexHtmlContent = await fs.readFile(
      path.join(__dirname,
      "../component-index.html"),
      "utf-8"
    );

    indexHtmlContent = indexHtmlContent.replace("<body>");
    // find </body> last index
    const endOfBody = indexHtmlContent.lastIndexOf("</body>");

    // insert the script in the end of the body
    const newHtml = `
      ${indexHtmlContent.substring(0, endOfBody)}
      <script>${loader}</script>
      ${indexHtmlContent.substring(endOfBody)}
    `;

    // Run it through some compiler, and set the results
    // on the asset.
    // let { code, map } = compile(source, sourceMap);
    asset.setCode(newHtml);

    // Return the asset
    return [asset];
  },
});
