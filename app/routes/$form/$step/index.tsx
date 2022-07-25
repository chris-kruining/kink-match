import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/cloudflare';
import { styled } from '../../../stiches.config.js';
// import ReactMarkdown from 'react-markdown'

interface Actor
{
    id: string,
    displayName: string,
}

interface Question
{
    id: string,
    label: string,
    description: string,
}

interface IndexData
{
    actors: Actor[],
    questions: Question[],
}

export const loader: LoaderFunction = async () => {
    return json<IndexData>({
        actors: [
            { id: '1', displayName: 'Him' },
            { id: '2', displayName: 'Her' },
        ],
        questions: [
            { id: 'question1', label: 'Question 1', description: `
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
            ` },
            { id: 'question2', label: 'Question 2', description: `Cool description` },
            { id: 'question3', label: 'Question 3', description: `Cool description` },
        ],
    });
};

export default function Index()
{
    const { actors, questions } = useLoaderData<IndexData>();

    return <>
        <Row>
            HEADER



            {actors.map((actor, i) =>
                <RangeRoot key={i}>
                    <b>{actor.displayName}</b>

                    <Header>Preferred</Header>
                    <Header>Curious</Header>
                    <Header>Neutral</Header>
                    <Header>Rather not</Header>
                    <Header>Absolutely not</Header>
                    <Header>Skip / n/a</Header>
                </RangeRoot>
            )}

        </Row>

        {questions.map((question, i) => <Row key={i}>
            <header>
                <details>
                    <QuestionLabel>{question.label}</QuestionLabel>

                    <p children={question.description} />
                </details>
            </header>

            {actors.map((actor, i) => <Inputs key={i} id={`${actor.id}.${question.id}`} />)}

        </Row>)}
    </>;
}

function Inputs({ id }: { id: string })
{
    return <InputsRoot>
        <Range id={`${id}.receiving`} label="Receiving" />
        <Range id={`${id}.giving`} label="Giving" />

        <Note>notes <NoteTextArea name={`${id}.note`} /></Note>
    </InputsRoot>;
}

function Range({ id, label }: { id: string, label: string })
{
    return <RangeRoot>
        <label>{label}</label>

        <input type="radio" name={`${id}`} value="yes" />
        <input type="radio" name={`${id}`} value="maybe" />
        <input type="radio" name={`${id}`} value="neutral" />
        <input type="radio" name={`${id}`} value="unlikely" />
        <input type="radio" name={`${id}`} value="no" />
        <input type="radio" name={`${id}`} value="skip" />
    </RangeRoot>;
}

const Row = styled('div', {
    display: 'grid',
    gridTemplateColumns: '20em',
    gridAutoFlow: 'column',
    gap: '$bigger',
    justifyContent: 'start',
});

const InputsRoot = styled('div', {
    display: 'grid',
    gap: '.5em',
    placeContent: 'start',
});

const RangeRoot = styled('div', {
    display: 'grid',
    gridTemplateColumns: '5em repeat(6, 2em)',
});

const Note = styled('label', {
    display: 'grid',
    gridTemplateColumns: '5em 12em',
    placeItems: 'start',
});

const NoteTextArea = styled('textarea', {
    minInlineSize: '100%',
    maxInlineSize: '100%',
});

const Header = styled('span', {
    writingMode: 'tb',
});

const QuestionLabel = styled('summary', {
    fontWeight: 'bold',
    fontSize: '1.2em',
});
