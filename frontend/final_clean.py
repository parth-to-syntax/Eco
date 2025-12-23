#!/usr/bin/env python3
"""Comprehensive TypeScript to JavaScript converter"""
import re
from pathlib import Path

def clean_file(file_path):
    """Remove all TypeScript syntax from a JavaScript file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Remove all forms of 'as any' and other type assertions
        content = re.sub(r'\(([^)]+)\s+as\s+any\)', r'\1', content)
        content = re.sub(r'\s+as\s+any', '', content)
        content = re.sub(r'\s+as\s+\w+', '', content)
        
        # Remove : any type annotations
        content = re.sub(r',\s*(\w+):\s*any([,)])', r', \1\2', content)
        content = re.sub(r'\((\w+):\s*any([,)])', r'(\1\2', content)
        
        # Remove React.forwardRef generic parameters (multiline versions)
        content = re.sub(
            r'React\.forwardRef<\s*[^>]+\s*,\s*[^>]+\s*>\s*\(',
            'React.forwardRef(',
            content,
            flags=re.DOTALL
        )
        
        # Remove orphaned interface and type declarations
        content = re.sub(r'^export\s+interface\s+\w+[^{]*\{[^}]*\}\s*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*interface\s+\w+[^{]*\{[^}]*\}\s*$', '', content, flags=re.MULTILINE)
        
        # Remove declare global blocks
        content = re.sub(r'declare\s+global\s*\{[^}]*\}', '', content, flags=re.DOTALL)
        
        # Clean up excessive blank lines
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

if __name__ == '__main__':
    src_dir = Path('/Users/parthsrivastava/Desktop/CJ/projects/EcoFinds/frontend/src')
    
    changed = []
    for pattern in ['**/*.jsx', '**/*.js']:
        for file_path in src_dir.glob(pattern):
            if clean_file(file_path):
                changed.append(file_path.relative_to(src_dir))
    
    if changed:
        print(f"Fixed {len(changed)} files:")
        for f in changed:
            print(f"  - {f}")
    else:
        print("No files needed fixing")
