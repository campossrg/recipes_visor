import { v2 as cloudinary } from "cloudinary";

type CloudinaryFolder = {
  name: string;
  path: string;
};

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  asset_folder?: string;
  filename?: string;
  display_name?: string;
};

export type RecipeImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orderKey: string;
};

export type RecipeBook = {
  slug: string;
  title: string;
  cover: RecipeImage | null;
  images: RecipeImage[];
};

export type RecipeBooksState = {
  books: RecipeBook[];
  source: "cloudinary" | "demo";
  message: string | null;
};

const SAMPLE_BOOKS: RecipeBook[] = [
  {
    slug: "weeknight-pasta",
    title: "Weeknight Pasta",
    cover: {
      id: "sample-pasta-1",
      src: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
      alt: "Weeknight Pasta cover",
      width: 1200,
      height: 1600,
      orderKey: "001",
    },
    images: [
      {
        id: "sample-pasta-1",
        src: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
        alt: "Pasta recipe page 1",
        width: 1200,
        height: 1600,
        orderKey: "001",
      },
      {
        id: "sample-pasta-2",
        src: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80",
        alt: "Pasta recipe page 2",
        width: 1200,
        height: 1600,
        orderKey: "002",
      },
    ],
  },
  {
    slug: "family-desserts",
    title: "Family Desserts",
    cover: {
      id: "sample-dessert-1",
      src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      alt: "Family Desserts cover",
      width: 1200,
      height: 1600,
      orderKey: "001",
    },
    images: [
      {
        id: "sample-dessert-1",
        src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
        alt: "Dessert recipe page 1",
        width: 1200,
        height: 1600,
        orderKey: "001",
      },
      {
        id: "sample-dessert-2",
        src: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
        alt: "Dessert recipe page 2",
        width: 1200,
        height: 1600,
        orderKey: "002",
      },
    ],
  },
];

let isConfigured = false;

function getCloudName() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
}

function getRootFolder() {
  return process.env.CLOUDINARY_LIBRARY_FOLDER?.trim() || "recipes-visor";
}

function configureCloudinary() {
  if (isConfigured) {
    return;
  }

  const cloudName = getCloudName();
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  isConfigured = true;
}

function slugifyBookName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBookTitle(name: string) {
  return name
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapResourceToImage(resource: CloudinaryResource): RecipeImage {
  const name = resource.filename || resource.display_name || resource.public_id.split("/").pop() || "Recipe page";

  return {
    id: resource.public_id,
    src: resource.secure_url,
    alt: name,
    width: resource.width,
    height: resource.height,
    orderKey: name.toLowerCase(),
  };
}

async function getFolderResources(folderPath: string) {
  const result = await cloudinary.api.resources_by_asset_folder(folderPath, {
    type: "upload",
    resource_type: "image",
    max_results: 500,
  });

  const resources = (result.resources || []) as CloudinaryResource[];

  return resources
    .map(mapResourceToImage)
    .sort((left, right) => left.orderKey.localeCompare(right.orderKey, undefined, { numeric: true }));
}

export function hasCloudinaryConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function getRecipeBooksState(): Promise<RecipeBooksState> {
  if (!hasCloudinaryConfig()) {
    return {
      books: SAMPLE_BOOKS,
      source: "demo",
      message: "Cloudinary is not configured, so demo books are shown.",
    };
  }

  try {
    configureCloudinary();

    const folderPath = getRootFolder();
    const result = await cloudinary.api.sub_folders(folderPath);
    const folders = ((result.folders || []) as CloudinaryFolder[]).sort((left, right) => left.name.localeCompare(right.name));

    const books = await Promise.all(
      folders.map(async (folder) => {
        const images = await getFolderResources(folder.path);

        return {
          slug: slugifyBookName(folder.name),
          title: formatBookTitle(folder.name),
          cover: images[0] || null,
          images,
        } satisfies RecipeBook;
      }),
    );

    return {
      books: books.filter((book) => book.images.length > 0),
      source: "cloudinary",
      message: null,
    };
  } catch (error) {
    console.error("Failed to load Cloudinary recipe books", error);

    return {
      books: SAMPLE_BOOKS,
      source: "demo",
      message: "Cloudinary could not be reached, so demo books are shown.",
    };
  }
}

export async function getRecipeBooks() {
  const { books } = await getRecipeBooksState();
  return books;
}

export async function getRecipeBook(slug: string) {
  const books = await getRecipeBooks();
  return books.find((book) => book.slug === slug) || null;
}

export function getRecipeLibraryFolder() {
  return getRootFolder();
}
