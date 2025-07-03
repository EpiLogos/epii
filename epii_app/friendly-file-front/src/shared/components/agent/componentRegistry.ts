/**
 * Agent Component Registry
 * Maps component names to React components for dynamic rendering
 */

import React from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '../ui/command';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

export interface ComponentRegistryEntry {
  component: React.ComponentType<any>;
  description: string;
  requiredProps: string[];
  optionalProps: string[];
  example?: any;
}

export interface GenerativeUIComponent {
  componentName: string;
  props: Record<string, any>;
  fallbackText?: string;
  metadata?: {
    source: 'agent' | 'subsystem';
    confidence: number;
  };
}

/**
 * Registry of components available for generative UI
 */
export const componentRegistry: Record<string, ComponentRegistryEntry> = {
  // Basic UI Components
  'Button': {
    component: Button,
    description: 'Interactive button component',
    requiredProps: ['children'],
    optionalProps: ['variant', 'size', 'onClick', 'disabled', 'className'],
    example: {
      children: 'Click me',
      variant: 'default',
      size: 'default'
    }
  },

  'Input': {
    component: Input,
    description: 'Text input component',
    requiredProps: [],
    optionalProps: ['placeholder', 'value', 'onChange', 'type', 'disabled', 'className'],
    example: {
      placeholder: 'Enter text...',
      type: 'text'
    }
  },

  'Label': {
    component: Label,
    description: 'Form label component',
    requiredProps: ['children'],
    optionalProps: ['htmlFor', 'className'],
    example: {
      children: 'Field Label'
    }
  },

  'Separator': {
    component: Separator,
    description: 'Visual separator component',
    requiredProps: [],
    optionalProps: ['orientation', 'className'],
    example: {
      orientation: 'horizontal'
    }
  },

  'Badge': {
    component: Badge,
    description: 'Badge component for labels and status',
    requiredProps: ['children'],
    optionalProps: ['variant', 'className'],
    example: {
      children: 'New',
      variant: 'default'
    }
  },

  // Alert Components
  'Alert': {
    component: Alert,
    description: 'Alert container component',
    requiredProps: ['children'],
    optionalProps: ['variant', 'className'],
    example: {
      children: 'Alert content',
      variant: 'default'
    }
  },

  'AlertDescription': {
    component: AlertDescription,
    description: 'Alert description text',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'This is an alert description'
    }
  },

  'AlertTitle': {
    component: AlertTitle,
    description: 'Alert title text',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Alert Title'
    }
  },

  // Card Components
  'Card': {
    component: Card,
    description: 'Card container component',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card content'
    }
  },

  'CardHeader': {
    component: CardHeader,
    description: 'Card header section',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card header'
    }
  },

  'CardTitle': {
    component: CardTitle,
    description: 'Card title component',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card Title'
    }
  },

  'CardDescription': {
    component: CardDescription,
    description: 'Card description text',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card description text'
    }
  },

  'CardContent': {
    component: CardContent,
    description: 'Card main content area',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card content'
    }
  },

  'CardFooter': {
    component: CardFooter,
    description: 'Card footer section',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Card footer'
    }
  },

  // Command Components
  'Command': {
    component: Command,
    description: 'Command palette container',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Command content'
    }
  },

  'CommandInput': {
    component: CommandInput,
    description: 'Command palette input',
    requiredProps: [],
    optionalProps: ['placeholder', 'value', 'onValueChange', 'className'],
    example: {
      placeholder: 'Search commands...'
    }
  },

  'CommandList': {
    component: CommandList,
    description: 'Command items list',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'Command items'
    }
  },

  'CommandEmpty': {
    component: CommandEmpty,
    description: 'Empty state for command list',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: 'No results found'
    }
  },

  'CommandGroup': {
    component: CommandGroup,
    description: 'Command items group',
    requiredProps: ['children'],
    optionalProps: ['heading', 'className'],
    example: {
      children: 'Command group items',
      heading: 'Group Title'
    }
  },

  'CommandItem': {
    component: CommandItem,
    description: 'Individual command item',
    requiredProps: ['children'],
    optionalProps: ['onSelect', 'disabled', 'value', 'className'],
    example: {
      children: 'Command item'
    }
  },

  'CommandSeparator': {
    component: CommandSeparator,
    description: 'Command list separator',
    requiredProps: [],
    optionalProps: ['className'],
    example: {}
  },

  'CommandShortcut': {
    component: CommandShortcut,
    description: 'Command keyboard shortcut',
    requiredProps: ['children'],
    optionalProps: ['className'],
    example: {
      children: '⌘K'
    }
  }
};

/**
 * Get component by name
 */
export const getComponent = (componentName: string): React.ComponentType<any> | null => {
  const entry = componentRegistry[componentName];
  return entry ? entry.component : null;
};

/**
 * Get component metadata
 */
export const getComponentMetadata = (componentName: string): ComponentRegistryEntry | null => {
  return componentRegistry[componentName] || null;
};

/**
 * Check if component exists
 */
export const hasComponent = (componentName: string): boolean => {
  return componentName in componentRegistry;
};

/**
 * Get all available component names
 */
export const getAvailableComponents = (): string[] => {
  return Object.keys(componentRegistry);
};

/**
 * Validate component props against registry
 */
export const validateComponentProps = (
  componentName: string, 
  props: Record<string, any>
): { isValid: boolean; missingProps: string[]; errors: string[] } => {
  const metadata = getComponentMetadata(componentName);
  
  if (!metadata) {
    return {
      isValid: false,
      missingProps: [],
      errors: [`Component '${componentName}' not found in registry`]
    };
  }

  const missingProps = metadata.requiredProps.filter(prop => !(prop in props));
  const errors: string[] = [];

  if (missingProps.length > 0) {
    errors.push(`Missing required props: ${missingProps.join(', ')}`);
  }

  return {
    isValid: missingProps.length === 0 && errors.length === 0,
    missingProps,
    errors
  };
};

/**
 * Get component example props
 */
export const getComponentExample = (componentName: string): any | null => {
  const metadata = getComponentMetadata(componentName);
  return metadata?.example || null;
};

/**
 * Register a new component
 */
export const registerComponent = (
  name: string,
  entry: ComponentRegistryEntry
): void => {
  componentRegistry[name] = entry;
};

/**
 * Unregister a component
 */
export const unregisterComponent = (name: string): boolean => {
  if (name in componentRegistry) {
    delete componentRegistry[name];
    return true;
  }
  return false;
};

/**
 * Get components by category (based on naming patterns)
 */
export const getComponentsByCategory = (): Record<string, string[]> => {
  const categories: Record<string, string[]> = {
    basic: [],
    alert: [],
    card: [],
    command: [],
    form: [],
    other: []
  };

  Object.keys(componentRegistry).forEach(componentName => {
    if (componentName.startsWith('Alert')) {
      categories.alert.push(componentName);
    } else if (componentName.startsWith('Card')) {
      categories.card.push(componentName);
    } else if (componentName.startsWith('Command')) {
      categories.command.push(componentName);
    } else if (['Input', 'Label'].includes(componentName)) {
      categories.form.push(componentName);
    } else if (['Button', 'Badge', 'Separator'].includes(componentName)) {
      categories.basic.push(componentName);
    } else {
      categories.other.push(componentName);
    }
  });

  return categories;
};

export default componentRegistry;