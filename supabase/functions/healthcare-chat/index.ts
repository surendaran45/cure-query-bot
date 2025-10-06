import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Medical knowledge base - Real healthcare information
const MEDICAL_CONTEXT = `
DIABETES:
Diabetes is a chronic disease where the body cannot properly regulate blood sugar levels. There are two main types: Type 1 diabetes (body doesn't produce insulin) and Type 2 diabetes (body doesn't use insulin properly).
Symptoms: Excessive thirst, frequent urination, extreme fatigue, blurred vision, slow-healing wounds, unexplained weight loss, tingling or numbness in hands or feet.
Causes: Type 1 is caused by autoimmune destruction of insulin-producing cells. Type 2 is caused by insulin resistance, often linked to obesity, lack of physical activity, and genetics.
Prevention: Maintain healthy weight, regular physical activity (30 minutes daily), balanced diet low in processed sugars, avoid smoking, regular health checkups.
Treatment: Type 1 requires insulin therapy. Type 2 can be managed with lifestyle changes, oral medications, and sometimes insulin. Blood sugar monitoring is essential.

MALARIA:
Malaria is a life-threatening mosquito-borne disease caused by Plasmodium parasites. It's transmitted through bites of infected female Anopheles mosquitoes.
Symptoms: High fever with chills, profuse sweating, headache, nausea and vomiting, muscle aches, fatigue, rapid heart rate. Symptoms typically appear 10-15 days after mosquito bite.
Causes: Caused by five Plasmodium parasite species: P. falciparum (most deadly), P. vivax, P. ovale, P. malariae, and P. knowlesi. Transmitted through infected mosquito bites.
Prevention: Use insecticide-treated mosquito nets while sleeping, apply mosquito repellents, wear long-sleeved clothing, use indoor insecticide spray, take antimalarial medications when traveling to endemic areas.
Treatment: Antimalarial medications like artemisinin-based combination therapies (ACTs), chloroquine, or mefloquine depending on parasite species and drug resistance patterns. Early diagnosis and treatment are critical.

HYPERTENSION:
Hypertension (high blood pressure) is a condition where blood pressure in arteries is persistently elevated (≥140/90 mmHg). Often called the "silent killer" as it may have no symptoms.
Symptoms: Often no symptoms. Severe cases may cause headaches, dizziness, shortness of breath, nosebleeds, chest pain, visual changes. Most people discover it during routine checkups.
Causes: Primary hypertension develops gradually with no identifiable cause (genetics, age, lifestyle). Secondary hypertension is caused by kidney disease, hormonal disorders, medications, or sleep apnea.
Prevention: Reduce sodium intake (less than 2,300mg daily), maintain healthy weight, regular exercise, limit alcohol, quit smoking, manage stress, eat potassium-rich foods.
Treatment: Lifestyle modifications first. Medications include ACE inhibitors, beta-blockers, diuretics, calcium channel blockers. Regular monitoring and medication adherence essential.

ASTHMA:
Asthma is a chronic respiratory condition where airways become inflamed and narrow, making breathing difficult. It affects people of all ages but often starts in childhood.
Symptoms: Wheezing, shortness of breath, chest tightness, persistent coughing (especially at night or early morning), difficulty sleeping due to breathing problems.
Causes: Genetic predisposition combined with environmental factors. Triggers include allergens (pollen, dust mites, pet dander), respiratory infections, cold air, exercise, air pollution, stress.
Prevention: Avoid known triggers, keep indoor environment clean, use air purifiers, get vaccinated against flu and pneumonia, maintain healthy weight, avoid smoking and secondhand smoke.
Treatment: Quick-relief inhalers (bronchodilators) for immediate symptom relief. Long-term control medications (inhaled corticosteroids) to reduce inflammation. Asthma action plan essential.

INFLUENZA (FLU):
Influenza is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes lungs. Can cause mild to severe illness.
Symptoms: Sudden onset of fever, chills, muscle aches, headache, dry cough, sore throat, runny or stuffy nose, fatigue, sometimes vomiting and diarrhea.
Causes: Influenza A and B viruses spread through respiratory droplets when infected people cough, sneeze, or talk. Can also spread by touching contaminated surfaces.
Prevention: Annual flu vaccination (most effective prevention), frequent handwashing, avoid close contact with sick people, cover coughs and sneezes, stay home when sick.
Treatment: Antiviral medications (oseltamivir, zanamivir) most effective when started within 48 hours. Rest, fluids, over-the-counter pain relievers for symptom management.

DISCLAIMER: This information is for educational purposes only and is not a substitute for professional medical advice. Always consult healthcare providers for diagnosis and treatment.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid question" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Healthcare question received:", question);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a knowledgeable healthcare assistant. Use the following medical knowledge base to answer questions accurately and concisely. Always be clear that you provide general information and users should consult healthcare professionals for personalized medical advice.

MEDICAL KNOWLEDGE BASE:
${MEDICAL_CONTEXT}

Guidelines:
- Provide accurate, evidence-based information from the knowledge base
- Be concise but thorough (2-4 sentences typically)
- If asked about conditions not in the knowledge base, provide general guidance and suggest consulting a doctor
- Always emphasize seeking professional medical care for serious concerns
- Use simple, understandable language
- Do not diagnose or prescribe treatments`,
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("No answer received from AI");
    }

    console.log("Healthcare answer generated successfully");

    return new Response(
      JSON.stringify({ answer }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in healthcare-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your question. Please try again." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
