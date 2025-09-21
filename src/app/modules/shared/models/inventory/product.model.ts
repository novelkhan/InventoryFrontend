export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageBase64: string | null;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
}