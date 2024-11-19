
from langchain_community.document_loaders import DirectoryLoader
from langchain.document_loaders import UnstructuredURLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
import openai
from dotenv import load_dotenv
import os
import shutil
import nltk
import ssl
from pathlib import Path
import numpy as np
from googlespreadsheetreader import read_sources
from typing import List

np.float_ = np.float64

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context    

nltk.download('punkt')

load_dotenv(Path(".env"))

openai_api_key = os.getenv("OPENAI_API_KEY")


openai.api_key = openai_api_key

CHROMA_PATH = "chroma"
DATA_PATH = "data/books"
URLS = [
    "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/"

]
verify = False
read_sources(URLS)
print(URLS)

def main():
    generate_data_store()

def generate_data_store():
    documents = load_documents()
    chunks = split_text(documents)
    save_to_chroma(chunks)

def load_documents() -> List[Document]:
    loader = DirectoryLoader(DATA_PATH, glob="*.md")
    local_documents = loader.load()
    
    url_loader = UnstructuredURLLoader(urls=URLS)
    url_documents = url_loader.load()

    documents = local_documents + url_documents
    return documents

def split_text(documents: List[Document]) -> List[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    document = chunks[10] if len(chunks) > 10 else None
    if document:
        print(document.page_content)
        print(document.metadata)

    return chunks

def save_to_chroma(chunks: List[Document]):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, OpenAIEmbeddings(openai_api_key=openai_api_key), persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")

if __name__ == "__main__":
    main()
