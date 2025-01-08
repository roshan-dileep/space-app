def querydata(query_text):
    from langchain_community.vectorstores import Chroma
    from langchain_openai import OpenAIEmbeddings
    from langchain_openai import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    from dotenv import load_dotenv
    from pathlib import Path
    import os
    import openai
    import numpy as np
   

    np.float_ = np.float64

    CHROMA_PATH = "chroma"

    PROMPT_TEMPLATE = """
    Answer the question based only on the following context:

    {context}

    ---

    Answer the question based on the above context: {question}
    """
    load_dotenv(Path(".env"))

    openai_api_key = os.getenv("OPENAI_API_KEY")
    print(f"OpenAI API Key: {openai_api_key}")
    if openai_api_key is None:
        raise ValueError("OpenAI API key not found. Make sure it's set in APIKEY.env.")

    openai.api_key = openai_api_key

    # Prepare the DB.
    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    

    model = ChatOpenAI(model="gpt-4o-mini").bind(logprobs=True)
    response_text = model.invoke(prompt)
    print(response_text)
    
    
    
    sources = [doc.metadata.get("source", None) for doc, _score in results]
    

    
    return {
        "response": response_text,
        "sources": sources,
        # "logprobs": logprobs
        
    }

querydata("What is time")