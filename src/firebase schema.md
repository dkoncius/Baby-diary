## Firestore Database Schema
users (collection)
│
└── [userId] (document)
    │
    ├── email: "user@example.com"
    │
    └── kids (subcollection)
        │
        ├── [kidId] (document)
        │   ├── name: "Kid Name"
        │   ├── birthDate: "yyyy-mm-dd"
        │   ├── height: number
        │   ├── weight: number
        │   ├── profileImage: "path/to/image.jpg"
        │
        └── [kidId] (document)
            ├── name: "Another Kid Name"
            ├── birthDate: "yyyy-mm-dd"
            ├── height: number
            ├── weight: number
            ├── profileImage: "path/to/image.jpg"
            │
            └── memories (subcollection)
                │
                ├── [memoryId] (document)
                │   ├── description: "Description of the memory"
                │   ├── date: "yyyy-mm-dd"
                │   └── images: ["path/to/image1.jpg", "path/to/image2.jpg", ...]
                │
                └── [memoryId] (document)
                    ├── description: "Another Description"
                    ├── date: "yyyy-mm-dd"
                    └── images: ["path/to/image3.jpg", "path/to/image4.jpg", ...]


## Cloud Storage Schema
users (directory)
│
└── [userId] (directory)
    │
    └── [kidId] (directory)
        │
        ├── profile-image (directory)
        │   └── image (e.g., profile-pic.jpg)
        │
        └── memories (directory)
            │
            └── [memoryId] (directory)
                ├── image1 (e.g., memory-pic1.jpg)
                ├── image2 (e.g., memory-pic2.jpg)
                └── ...

