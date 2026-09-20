import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Homepage Panels")
        .child(
          S.document()
            .schemaType("homepagePanels")
            .documentId("homepagePanels"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          listItem.getId() !== "siteSettings" &&
          listItem.getId() !== "homepagePanels",
      ),
    ]);
