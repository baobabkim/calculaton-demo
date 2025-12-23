/**
 * Calculator Engine
 * 
 * Core calculation engine following SOLID principles:
 * - SRP: Only responsible for evaluating mathematical expressions
 * - DIP: Depends on abstraction (mathEngine interface)
 */

import { create, all } from 'mathjs';

export class Calculator {
    /**
     * Creates a Calculator instance
     * @param {Object} mathEngine - Math engine (default: math.js)
     */
    constructor(mathEngine = null) {
        // Dependency Injection: Allow custom math engine for testing
        this.mathEngine = mathEngine || create(all);
    }

    /**
   * Evaluates a mathematical expression
   * @param {string} expression - Mathematical expression to evaluate
   * @returns {string} Result as string or "Error"
   */
    evaluate(expression) {
        try {
            // Handle null/undefined
            if (expression == null || expression === undefined) {
                return 'Error';
            }

            // Convert to string if needed
            const expr = String(expression).trim();

            // Check for empty expression
            if (expr === '') {
                return 'Error';
            }

            // Validate parentheses
            if (!this.validateParentheses(expr)) {
                return 'Error';
            }

            // Validate syntax (before preprocessing)
            if (!this.validateSyntax(expr)) {
                return 'Error';
            }

            // Preprocess expression: convert symbols
            const processedExpr = this.preprocessExpression(expr);

            // Evaluate using math engine
            const result = this.mathEngine.evaluate(processedExpr);

            // Check for invalid results
            if (!isFinite(result)) {
                return 'Error';
            }

            if (isNaN(result)) {
                return 'Error';
            }

            // Format and return result
            return this.formatResult(result);
        } catch (error) {
            return 'Error';
        }
    }

    /**
     * Validates that parentheses are balanced
     * @param {string} expr - Expression to validate
     * @returns {boolean} True if parentheses are balanced
     * @private
     */
    validateParentheses(expr) {
        const open = (expr.match(/\(/g) || []).length;
        const close = (expr.match(/\)/g) || []).length;

        if (open !== close) {
            return false;
        }

        // Check for empty parentheses
        if (expr.includes('()')) {
            return false;
        }

        // Check for proper nesting
        let depth = 0;
        for (const char of expr) {
            if (char === '(') depth++;
            if (char === ')') depth--;
            if (depth < 0) return false;
        }

        return depth === 0;
    }

    /**
     * Validates expression syntax for invalid operator patterns
     * @param {string} expr - Expression to validate
     * @returns {boolean} True if syntax is valid
     * @private
     */
    validateSyntax(expr) {
        // Define operators (including unicode symbols)
        const operators = ['+', '-', '*', '/', '×', '÷', '^'];

        // Check for double operators (e.g., "2 + + 3")
        for (let i = 0; i < expr.length - 1; i++) {
            const current = expr[i];

            // Skip if current is not an operator
            if (!operators.includes(current)) continue;

            // Look for next non-space character
            let j = i + 1;
            while (j < expr.length && expr[j] === ' ') {
                j++;
            }

            if (j < expr.length) {
                const nextNonSpace = expr[j];
                // If next non-space is also an operator (except minus for negative numbers)
                if (operators.includes(nextNonSpace)) {
                    // Allow "operator followed by minus" for negative numbers (e.g., "2 * -3")
                    // But disallow "operator followed by other operators" (e.g., "2 + + 3")
                    if (nextNonSpace !== '-') {
                        return false;
                    }
                    // Also disallow "minus followed by minus" (e.g., "2 - - 3")
                    if (current === '-' && nextNonSpace === '-') {
                        return false;
                    }
                }
            }
        }

        // Check for leading operator (except minus for negative numbers)
        const firstNonSpace = expr.trim()[0];
        if (operators.includes(firstNonSpace) && firstNonSpace !== '-') {
            return false;
        }

        // Check for trailing operator
        const lastNonSpace = expr.trim()[expr.trim().length - 1];
        if (operators.includes(lastNonSpace)) {
            return false;
        }

        return true;
    }

    /**
     * Preprocesses expression to normalize symbols
     * @param {string} expr - Raw expression
     * @returns {string} Processed expression
     * @private
     */
    preprocessExpression(expr) {
        return expr
            .replace(/×/g, '*')  // Convert × to *
            .replace(/÷/g, '/')  // Convert ÷ to /
            .trim();
    }

    /**
     * Formats the calculation result
     * @param {number} result - Calculation result
     * @returns {string} Formatted result
     * @private
     */
    formatResult(result) {
        // Round to avoid floating point precision issues
        const rounded = Math.round(result * 1e10) / 1e10;

        // Convert to string and remove unnecessary decimals
        const str = rounded.toString();

        return str;
    }
}
