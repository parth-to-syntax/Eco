#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def fix_typescript_syntax(content):
    """Remove TypeScript syntax from JavaScript files"""
    
    # Remove interface declarations
    content = re.sub(r'^export interface [\w<>]+\s*{[^}]*}', '', content, flags=re.MULTILINE | re.DOTALL)
    content = re.sub(r'^interface [\w<>]+\s*{[^}]*}', '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Remove type alias declarations
    content = re.sub(r'^export type \w+ = [^;]+;', '', content, flags=re.MULTILINE)
    content = re.sub(r'^type \w+ = [^;]+;', '', content, flags=re.MULTILINE)
    content = re.sub(r'^type \w+ = React\.[^\n]+$', '', content, flags=re.MULTILINE)
    
    # Remove import type statements
    content = re.sub(r'import type \{[^}]+\} from', 'import {', content)
    content = re.sub(r', type \w+', '', content)
    
    # Remove React.forwardRef generic parameters (multiline)
    content = re.sub(r'React\.forwardRef<[^>]+>\s*\(\(\{', 'React.forwardRef(({', content, flags=re.DOTALL)
    
    # Remove function parameter type annotations
    content = re.sub(r'\((\w+): [\w<>|&\[\] .?]+\)', r'(\1)', content)
    content = re.sub(r',\s*(\w+): [\w<>|&\[\] .?]+\)', r', \1)', content)
    content = re.sub(r'\({ \.\.\.props }: \w+\)', '({ ...props })', content)
    
    # Clean up multiple blank lines
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    return content

if __name__ == '__main__':
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()
    
    fixed_content = fix_typescript_syntax(content)
    
    with open(file_path, 'w') as f:
        f.write(fixed_content)
    
    print(f"Fixed: {file_path}")
