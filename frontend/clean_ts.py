#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def clean_typescript(content):
    """Aggressively remove all TypeScript syntax"""
    
    # Remove type annotations from function parameters and variables
    content = re.sub(r':\s*string([,\)])', r'\1', content)
    content = re.sub(r':\s*number([,\)])', r'\1', content)
    content = re.sub(r':\s*boolean([,\)])', r'\1', content)
    content = re.sub(r':\s*React\.\w+', '', content)
    content = re.sub(r':\s*Promise<[^>]+>', '', content)
    content = re.sub(r':\s*Partial<[^>]+>', '', content)
    content = re.sub(r':\s*string\[\]', '[]', content)
    content = re.sub(r':\s*number\[\]', '[]', content)
    
    # Remove optional type annotations
    content = re.sub(r'\?\?\s*:\s*string', '?', content)
    content = re.sub(r'\?\s*:\s*string', '?', content)
    content = re.sub(r'\?\s*:\s*number', '?', content)
    content = re.sub(r'\?\s*:\s*boolean', '?', content)
    content = re.sub(r'\?\s*:\s*React\.\w+', '?', content)
    
    # Remove 'as const'
    content = re.sub(r'\s+as const', '', content)
    
    # Remove multi-line function type annotations
    content = re.sub(r'async\s+\(([^)]+):\s*[^=]+\)\s*=>\s*\{', r'async (\1) => {', content)
    
    return content

if __name__ == '__main__':
    import glob
    
    src_dir = Path('/Users/parthsrivastava/Desktop/CJ/projects/EcoFinds/frontend/src')
    
    files = list(src_dir.glob('**/*.jsx')) + list(src_dir.glob('**/*.js'))
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            fixed_content = clean_typescript(content)
            
            if original != fixed_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                print(f"Fixed: {file_path.relative_to(src_dir.parent)}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}", file=sys.stderr)
