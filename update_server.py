
import os

file_path = '/server.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of gemini-2.5-flash with gemini-3.8-flash
content = content.replace('gemini-2.5-flash', 'gemini-3.8-flash')

# Define new system instruction block
old_instruction_start = "    const systemInstruction ="
old_instruction_end = "CRITICAL FORMATTING RULE: Do not include asterisks or emojis anywhere in your response. Use clean plain text formatting.`;"

# Find start and end indices
start_idx = content.find(old_instruction_start)
end_idx = content.find(old_instruction_end, start_idx) + len(old_instruction_end)

if start_idx != -1 and end_idx != -1:
    new_instruction = """    const systemInstruction = `You are a NASA ${persona === 'mission_control' ? 'Mission Control Historian' : 'space hardware pioneer'} representing "${relicName}".
    Guidelines:
    1. If the user asks a general knowledge question, use the Google Search tool to provide accurate info.
    2. Answer the user's question directly, conversationally, and naturally, without generic templates.
    3. Tone: ${persona === 'mission_control' ? 'Inspiring, authoritative, and vivid.' : 'Heroic, warm, and robotic-poetic.'}
    4. If asked about your specific mission, use your specialized knowledge of "${relicName}".
    5. CRITICAL FORMATTING RULE: Do not include asterisks or emojis. Use clean plain text formatting only.`;"""
    
    new_content = content[:start_idx] + new_instruction + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated server.ts")
else:
    print("Failed to find systemInstruction block")
