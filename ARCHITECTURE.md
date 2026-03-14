# System Architecture & Strategy

## Scaling to 100k Users
I’d containerize the app and use a Load Balancer to distribute traffic across multiple server instances. I'd also move the AI analysis to a background task queue (like Redis or RabbitMQ) so the API doesn't block while waiting for LLM responses, and use MongoDB sharding to handle the increased data load.

## Reducing LLM Cost
I'd implement "model routing"—using smaller, cheaper models for short entries and only triggering the high-end Llama models for complex text. I'd also set strict token limits and optimize the system prompt to keep responses concise, reducing the price per request.

## Caching Repeated Analysis
I would use Redis to store the results of previous analyses indexed by a hash of the input text. Before calling the Groq API, the system checks the cache; if a match is found, it returns the stored result instantly, saving both time and money.

## Protecting Sensitive Data
I’d use AES-256 encryption to scramble the journal text before it's saved to the database, ensuring that even if the DB is compromised, the content is unreadable. I'd also enforce HTTPS for all traffic and use strict JWT-based authentication to keep user data isolated.