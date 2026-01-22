import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface ArticleData {
  title: string;
  description: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "articles";

export async function publishArticle(
  data: Omit<ArticleData, "createdAt">
): Promise<Article> {
  const articleData: ArticleData = {
    ...data,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), articleData);

  return {
    id: docRef.id,
    ...articleData,
  };
}

export async function updateArticle(
  id: string,
  data: Partial<ArticleData>
): Promise<Article> {
  const articleRef = doc(db, COLLECTION_NAME, id);
  const updatedData: Partial<ArticleData> = {
    ...data,
    updatedAt: new Date(),
  };

  await updateDoc(articleRef, updatedData);

  return {
    id,
    title: data.title || "",
    description: data.description || "",
    content: data.content || "",
    category: data.category || "",
    author: data.author || "",
    createdAt: new Date(),
    ...updatedData,
  };
}

export async function deleteArticle(id: string): Promise<void> {
  const articleRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(articleRef);
}

export async function getArticles(): Promise<Article[]> {
  const articlesQuery = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(articlesQuery);
  const articles: Article[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    articles.push({
      id: doc.id,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      author: data.author,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || undefined,
    });
  });

  return articles;
}
