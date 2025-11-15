# 📱 Reddit Clone – React Native + Supabase

A full-featured Reddit-style mobile application built with **React Native (Expo)**, **TypeScript**, **Supabase**, **Clerk**, and **TanStack Query**.  
This project replicates core Reddit functionality—creating posts, authentication, media uploads, real-time data, and smooth navigation—while showcasing production-grade mobile architecture.

---

## 🚀 Features

- 🔐 **Authentication** with Clerk (signup, login, session persistence)
- 📝 **Post Creation** (text + images)
- 🗄️ **Supabase Storage** for media uploads
- 🔁 **Real-time updates** via Supabase Channels
- ✏️ **CRUD operations** for posts and user data
- 🌐 **Global State** with Jotai
- ⚡ **Server Caching & Fetching** with TanStack Query
- 📜 **Efficient Feed Rendering** using FlatList
- 🧭 **Smooth Navigation** using Expo Router
- ⚙️ **Performance Optimizations** (`memo`, `useCallback`)

---

## 🛠️ Tech Stack

### **Frontend**
- React Native (Expo)
- TypeScript
- Expo Router
- Jotai
- TanStack Query

### **Backend**
- Supabase (Database, Storage, Policies)
- Clerk (Authentication)

---

## 📂 Project Structure

app/

├── (tabs)/

├── post/

├── components/

├── hooks/

├── services/

└── lib/

---

## 🧩 What I Learned

- Designing and structuring a scalable mobile codebase  
- Creating relational schemas and policies in Supabase  
- Implementing secure authentication flows  
- Managing server + client state in a real-world app  
- Building performant, responsive UI components  
- Architecting real-time features  
- Using Expo Router for clean navigation patterns  

---

## 📦 Installation

```bash
git clone <repo-url>
cd reddit-clone
npm install
npx expo start

Create a .env file with your Supabase and Clerk keys.

⸻

🔗 Links
https://github.com/user-attachments/assets/235c3570-a92c-4539-9c40-25e26cf0474b
