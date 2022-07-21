import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/cloudflare';
import { styled } from '~/stiches.config.js';
import ReactMarkdown from 'react-markdown'
import url from 'url';

interface Question
{
    id: string,
    label: string,
    description: string,
}

interface IndexData
{
    questions: Question[],
}

export const loader: LoaderFunction = async () => {
    console.log(url);

    return json<IndexData>({
        questions: [
            { id: 'question1', label: 'Question 1', description: `
                # Title
                
                A paragraph with *emphasis* and **strong importance**.
                
                > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
                
                * Lists
                * [ ] todo
                * [x] done
                
                A table:
                
                | a | b |
                | - | - |
            ` },
            { id: 'question2', label: 'Question 2', description: `
                # Cool description
            ` },
            { id: 'question3', label: 'Question 3', description: `
                # Cool description
            ` },
        ],
    });
};

export default function Index()
{
    console.log(url);

    const { questions } = useLoaderData<IndexData>();

    return <>
        <Row>
            HEADER

            <RangeRoot>
                <div />

                <Header>Preferred</Header>
                <Header>Neutral</Header>
                <Header>Rather not</Header>
                <Header>Curious</Header>
            </RangeRoot>
        </Row>

        {questions.map((question, i) => <Row key={i}>
            <header>
                <label style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{question.label}</label>

                <ReactMarkdown children={question.description} />
            </header>

            <Inputs id="" />
        </Row>)}
    </>;
}

function Inputs({ id }: { id: string })
{
    return <InputsRoot>
        <Range id={`${id}.receiving`} label="Receiving" />
        <Range id={`${id}.giving`} label="Giving" />
    </InputsRoot>;
}

function Range({ id, label }: { id: string, label: string })
{
    return <RangeRoot>
        <label>{label}</label>

        <input type="radio" name={`${id}.yes`} />
        <input type="radio" name={`${id}.neutral`} />
        <input type="radio" name={`${id}.no`} />
        <input type="radio" name={`${id}.maybe`} />
    </RangeRoot>;
}

const Row = styled('div', {
    display: 'grid',
    gridTemplateColumns: '20em auto',
    justifyContent: 'start',
});

const InputsRoot = styled('div', {
    display: 'grid',
    gap: '.5em',
    placeContent: 'start',
});

const RangeRoot = styled('div', {
    display: 'grid',
    gridTemplateColumns: '5em repeat(4, 2em)',
});

const Header = styled('span', {
    writingMode: 'tb',
});