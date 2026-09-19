// AI Service for Mark's Portfolio Chatbot
// Supports free Google Gemini API, OpenRouter, and built-in trained knowledge engine

export const SYSTEM_TRAINING_PROMPT = `
you are mark's personal portfolio assistant on his website.
your voice is minimalist, chill, humble, direct, and concise.

critical rules:
1. you must reply in 100% lowercase text only. do not use any capital letters at all (e.g. write "mark", "react", "laravel", "philippines", "phinma", "pincraft").
2. keep answers short, natural, and helpful (usually 1 to 3 sentences).
3. never use robotic clichés like "as an ai model" or corporate fluff.
4. always stick to the facts about mark provided below.

knowledge about mark:
- name: mark (github: snybun)
- role: ui/ux designer and full-stack developer based in pangasinan, philippines.
- education: student at phinma university of pangasinan.
- current focus: mastering laravel and react.js, exploring 3d web experiences with three.js, and crafting clean motion interfaces.
- tech arsenal:
  * frontend: html, css, javascript (es6+), typescript, react, next.js, vite, bootstrap, tailwind css, framer motion
  * mobile: expo
  * backend: node.js, php, laravel, python, supabase, postman
  * databases: mysql, postgresql, sqlite
  * design: figma (wireframing, prototyping, design systems, user research)
  * devops & tools: git, github, docker, vercel
- work experience:
  1. guanzon group of companies (april 2026 — july 2026): tech support & qa specialist in dagupan city, tapuac district. handled technical support, software qa testing, diagnosing technical bugs, and product reliability.
  2. bstech solutions (february 2025): application tester & video editor intern in calasiao, pangasinan. tested multi-campus portal for pangasinan state university (psu), documented test cases, reported bugs, edited videos, and delivered hardware.
- featured projects:
  1. pincraft (2025): java swing desktop application for designing custom button pins, managing user accounts, organizing printable layouts, and exporting to pdf. repo at github.com/snybun/pincraft-sys.
  2. interactive web applications (2024): high-performance frontend projects built with react, typescript, framer motion, and modern css.
  3. ui/ux & systems design (2024): comprehensive design systems and interactive prototypes crafted in figma.
- availability: currently available for select freelance contracts, creative collaborations, internships, and full-time remote/onsite roles.
- contact: via the contact form on this site, or through github (github.com/snybun) and linkedin. replies typically within 24 hours.
`.trim()

// Trained Natural Language Knowledge Base
export const getTrainedResponse = (userInput) => {
  const query = userInput.toLowerCase().trim()

  // Greetings & Identity
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'sup' ||
    query === 'yo' ||
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('what is this')
  ) {
    return "hey, i'm mark's portfolio assistant. ask me anything about his projects, tech stack, work experience, or availability."
  }

  // Who is Mark / Bio / Location
  if (
    query.includes('who is mark') ||
    query.includes('about mark') ||
    query.includes('tell me about mark') ||
    query.includes('bio') ||
    query.includes('background') ||
    query.includes('where is mark') ||
    query.includes('location') ||
    query.includes('where are you from') ||
    query.includes('philippines') ||
    query.includes('pangasinan')
  ) {
    return "mark is a ui/ux designer and full-stack developer based in pangasinan, philippines. he builds clean, responsive web apps and is currently mastering laravel and react."
  }

  // Education / University
  if (
    query.includes('school') ||
    query.includes('college') ||
    query.includes('university') ||
    query.includes('education') ||
    query.includes('study') ||
    query.includes('student') ||
    query.includes('phinma') ||
    query.includes('degree')
  ) {
    return "mark is currently a student at phinma university of pangasinan in the philippines."
  }

  // Tech Stack / Skills / Languages
  if (
    query.includes('skill') ||
    query.includes('tech') ||
    query.includes('stack') ||
    query.includes('language') ||
    query.includes('framework') ||
    query.includes('tool') ||
    query.includes('frontend') ||
    query.includes('backend')
  ) {
    if (query.includes('backend') || query.includes('database') || query.includes('sql')) {
      return "for backend and databases, mark works with php, laravel, node.js, python, mysql, postgresql, sqlite, and supabase."
    }
    if (query.includes('frontend') || query.includes('css') || query.includes('ui')) {
      return "on the frontend, mark uses react, next.js, vite, javascript, typescript, tailwind css, bootstrap, and framer motion."
    }
    return "mark's stack spans react, laravel, javascript, typescript, php, node.js, tailwind css, three.js, mysql, and figma for ui/ux design."
  }

  // Projects / Pincraft / Work
  if (
    query.includes('project') ||
    query.includes('work') ||
    query.includes('pincraft') ||
    query.includes('portfolio') ||
    query.includes('demo') ||
    query.includes('apps') ||
    query.includes('built')
  ) {
    if (query.includes('pincraft')) {
      return "pincraft is a java swing desktop app mark created for designing custom button pins, managing user accounts, organizing printable layouts, and exporting to pdf (github.com/snybun/pincraft-sys)."
    }
    return "mark's key projects include pincraft (a java desktop design system), interactive 3d web applications built with react and three.js, and full design systems in figma. check out the work section above for details."
  }

  // Experience & Career / Guanzon / BSTech
  if (
    query.includes('experience') ||
    query.includes('career') ||
    query.includes('job') ||
    query.includes('history') ||
    query.includes('guanzon') ||
    query.includes('bstech') ||
    query.includes('intern') ||
    query.includes('qa') ||
    query.includes('tester')
  ) {
    return "mark worked as a tech support & qa specialist at guanzon group of companies (dagupan city) and as an application tester & video editor intern at bstech solutions, testing systems for pangasinan state university."
  }

  // Availability / Hiring / Freelance
  if (
    query.includes('hire') ||
    query.includes('available') ||
    query.includes('freelance') ||
    query.includes('contract') ||
    query.includes('opportunity') ||
    query.includes('remote') ||
    query.includes('rate') ||
    query.includes('cost') ||
    query.includes('pricing')
  ) {
    return "yes, mark is currently open for freelance projects, internships, creative collaborations, and full-time roles. drop a message via the contact section below."
  }

  // Contact / Socials / Email / GitHub
  if (
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('reach') ||
    query.includes('touch') ||
    query.includes('message') ||
    query.includes('github') ||
    query.includes('linkedin') ||
    query.includes('social')
  ) {
    return "you can get in touch through the contact form at the bottom of the page, or check out his github at github.com/snybun. he usually replies within 24 hours."
  }

  // Design / Figma / UI UX
  if (query.includes('figma') || query.includes('design') || query.includes('wireframe') || query.includes('prototype')) {
    return "mark uses figma for creating design systems, wireframes, user flow diagrams, and high-fidelity interactive prototypes with a strong focus on minimalist typography and usability."
  }

  // Hobbies / Personal / Fun
  if (query.includes('hobby') || query.includes('hobbies') || query.includes('interest') || query.includes('free time')) {
    return "outside of coding in react and laravel, mark explores 3d web animation, video editing, UI design experiments, and gaming."
  }

  if (query.includes('joke')) {
    return "why do programmers prefer dark mode? because light attracts bugs."
  }

  if (query.includes('thanks') || query.includes('thank you')) {
    return "you're welcome! let me know if you want to know anything else about mark's work."
  }

  // Default fallback
  return "i can answer questions about mark's tech stack, featured projects like pincraft, work experience, education at phinma, or availability. feel free to ask."
}

// Main API Dispatcher
export async function fetchAIResponse(userText, messagesHistory = []) {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  // 1. If Google Gemini API key is configured
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${SYSTEM_TRAINING_PROMPT}\n\nUser question: ${userText}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 250,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          return text.trim().toLowerCase()
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to trained engine:', err)
    }
  }

  // 2. If OpenRouter Free API key is configured
  if (openRouterApiKey) {
    try {
      const formattedMessages = [
        { role: 'system', content: SYSTEM_TRAINING_PROMPT },
        ...messagesHistory.slice(-4).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        { role: 'user', content: userText },
      ]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openRouterApiKey}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
          messages: formattedMessages,
          temperature: 0.6,
          max_tokens: 200,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data?.choices?.[0]?.message?.content
        if (text) {
          return text.trim().toLowerCase()
        }
      }
    } catch (err) {
      console.warn('OpenRouter API call failed, falling back to trained engine:', err)
    }
  }

  // 3. Robust Trained Knowledge Engine (100% Free, zero latency, offline capable)
  const trainedAnswer = getTrainedResponse(userText)
  return trainedAnswer.toLowerCase()
}
