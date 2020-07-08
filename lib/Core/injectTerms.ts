import { Term } from "../ReactViewModels/defaultTerms";

const findFirstTerm = (
  text: string,
  terms: Map<string, Term>,
  fromIndex: number
) => {
  let termIndex = Infinity;
  let termLength = 0;
  let termToReplace: string | undefined;
  let ignore = false;

  terms.forEach((_, term) => {
    const foundIndex = text
      .toLowerCase()
      .indexOf(term.toLowerCase(), fromIndex);
    if (
      foundIndex !== -1 &&
      (foundIndex < termIndex ||
        (foundIndex <= termIndex && term.length > termLength))
    ) {
      const nextOpeningBrace = text.toLowerCase().indexOf("[", foundIndex);
      const nextClosingBrace = text.toLowerCase().indexOf("]", foundIndex);
      const hasNextClosingBrace = nextClosingBrace !== -1;
      const nextBracesAreClosedLink =
        nextOpeningBrace !== -1 &&
        hasNextClosingBrace &&
        nextOpeningBrace < nextClosingBrace;
      const inLinkLabel = hasNextClosingBrace && !nextBracesAreClosedLink;

      const nextOpeningParen = text.toLowerCase().indexOf("(", foundIndex);
      const nextClosingParen = text.toLowerCase().indexOf(")", foundIndex);
      const hasNextClosingParen = nextClosingParen !== -1;
      const nextParensAreClosedLink =
        nextOpeningParen !== -1 &&
        hasNextClosingParen &&
        nextOpeningParen < nextClosingParen;
      const inLinkHref = hasNextClosingParen && !nextParensAreClosedLink;

      const nextOpeningATag = text.toLowerCase().indexOf("<a ", foundIndex);
      const nextClosingATag = text.toLowerCase().indexOf("</a>", foundIndex);
      const hasNextClosingATag = nextClosingATag !== -1;
      const nextTagIsClosing =
        nextOpeningATag !== -1 &&
        hasNextClosingATag &&
        nextOpeningATag < nextClosingATag;
      const inAhref = hasNextClosingATag && !nextTagIsClosing;

      const lastNewLine = text.toLowerCase().lastIndexOf("\n", foundIndex);
      const hasLastNewLine = lastNewLine !== -1;
      const lastNewLineIsHeading = text[lastNewLine + 1] === "#";
      // Some help content will have headings on the very first line,
      // so if we've found a term in the middle of a heading, we'll be
      // parsing the very first line
      const firstLineIsHeading = !hasLastNewLine && text[0] === "#";
      const inHeading =
        (hasLastNewLine && lastNewLineIsHeading) || firstLineIsHeading;

      ignore = inLinkLabel || inLinkHref || inHeading || inAhref;
      termIndex = foundIndex;
      termLength = term.length;
      termToReplace = text.substr(foundIndex, term.length);
    }
  });

  return { termToReplace, termIndex, ignore };
};

const injectTerms = (string: string, termDictionary: Term[]): string => {
  let injectIndex = 0;
  const injectedBoldSet = new Set();
  while (1) {
    let tooltipTerms = new Map<string, Term>();
    termDictionary.forEach((item: any) =>
      tooltipTerms.set(item.term.toLowerCase(), item)
    );
    // some help content things will have aliases / variants
    termDictionary.forEach(term => {
      term.aliases?.forEach(alias => {
        tooltipTerms.set(alias.toLowerCase(), term);
      });
    });
    const { termIndex, termToReplace, ignore } = findFirstTerm(
      string,
      tooltipTerms,
      injectIndex
    );
    if (
      termToReplace !== undefined &&
      !ignore &&
      !injectedBoldSet.has(termToReplace.toLowerCase())
    ) {
      const currentText = string;
      const termObj = tooltipTerms.get(termToReplace.toLowerCase());
      const description = termObj?.content || "missing content";
      // const injectedLink = `**${termToReplace}**`;
      const injectedLink = `<terriatooltip title="${termToReplace}">${description}</terriatooltip>`;
      string = currentText.substring(0, termIndex);
      string += injectedLink;
      string += currentText.substring(termIndex + termToReplace.length);
      injectIndex = termIndex + injectedLink.length;
      injectedBoldSet.add(termToReplace.toLowerCase());
    } else if (
      (termToReplace && ignore) ||
      (termToReplace &&
        !ignore &&
        injectedBoldSet.has(termToReplace.toLowerCase()))
    ) {
      injectIndex = termIndex + termToReplace.length;
    } else {
      break;
    }
  }
  return string;
};

export default injectTerms;