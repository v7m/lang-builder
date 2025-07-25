import { Space, Tag, Typography, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WordEntryDocument } from '@/services/database';

const { Text } = Typography;

export const getPartOfSpeechColor = (partOfSpeech: string) => {
  const colors: Record<string, string> = {
    noun: 'blue',
    verb: 'green',
    adjective: 'orange',
    adverb: 'purple',
    pronoun: 'cyan',
    preposition: 'magenta',
    particle: 'lime',
    conjunction: 'geekblue',
    interjection: 'volcano',
    numeral: 'gold',
    article: 'red',
    unknown: 'default'
  };
  return colors[partOfSpeech] || 'default';
};

export const getGenderColor = (gender: string) => {
  const colors: Record<string, string> = {
    neuter: 'green',
    masculine: 'blue',
    feminine: 'red'
  };
  return colors[gender] || 'default';
};

export const getRegularColor = (regular: boolean) => {
  return regular ? 'green' : 'orange';
};

export const renderForms = (forms: unknown) => {
  if (!forms) return <Text type="secondary">-</Text>;

  if (typeof forms === 'string') {
    return <Text>{forms}</Text>;
  }

  if (typeof forms === 'object' && forms !== null && 'base' in forms) {
    return <Text>{(forms as { base: string }).base}</Text>;
  }

  if (typeof forms === 'object' && forms !== null) {
    const formEntries = Object.entries(forms);
    if (formEntries.length === 0) {
      return <Text type="secondary">-</Text>;
    }

    return (
      <Space direction="vertical" size={0}>
        {formEntries.map(([key, value]) => (
          <Text key={key} style={{ lineHeight: '1.2' }}>
            <Text type="secondary">{key}: </Text>
            {value === null || value === 'null' ? '-' : String(value)}
          </Text>
        ))}
      </Space>
    );
  }

  return <Text type="secondary">-</Text>;
};

export const createCommonColumns = (
  expandedExamples: Set<string>,
  setExpandedExamples: (expanded: Set<string>) => void
): ColumnsType<WordEntryDocument> => [
  {
    title: 'Word',
    dataIndex: 'word',
    key: 'word',
    width: 120,
    align: 'center',
    render: (word: string) => <Text strong>{word}</Text>,
  },
  {
    title: 'Grammar',
    dataIndex: 'grammar',
    key: 'grammar',
    width: 120,
    align: 'center',
    render: (grammar: { partOfSpeech: string; gender?: string; regular: boolean }) => {
      if (!grammar) return <Text type="secondary">-</Text>;

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Tag color={getPartOfSpeechColor(grammar.partOfSpeech)}>
              {grammar.partOfSpeech}
            </Tag>
            {grammar.gender && (
              <Tag color={getGenderColor(grammar.gender)} style={{ marginLeft: '-5px' }}>
                {grammar.gender.charAt(0).toUpperCase()}
              </Tag>
            )}
          </div>
          <Tag color={getRegularColor(grammar.regular)}>
            {grammar.regular ? 'regular' : 'irregular'}
          </Tag>
        </div>
      );
    },
  },
  {
    title: 'Translation',
    dataIndex: ['translations', 'ru'],
    key: 'translation',
    width: 200,
    align: 'center',
    render: (translation: string) => translation || <Text type="secondary">-</Text>,
  },
  {
    title: 'Forms',
    dataIndex: 'forms',
    key: 'forms',
    width: 200,
    align: 'center',
    render: renderForms,
  },
  {
    title: 'Examples',
    dataIndex: 'examples',
    key: 'examples',
    width: 200,
    align: 'center',
    render: (examples: string[], record: WordEntryDocument) => {
      if (!examples || examples.length === 0) {
        return <Text type="secondary">-</Text>;
      }

      const recordId = String(record._id);
      const isExpanded = expandedExamples.has(recordId);
      const showExamples = isExpanded ? examples : examples.slice(0, 1);
      const hasMore = examples.length > 1;

      const toggleExpanded = () => {
        const newExpanded = new Set(expandedExamples);
        if (isExpanded) {
          newExpanded.delete(recordId);
        } else {
          newExpanded.add(recordId);
        }
        setExpandedExamples(newExpanded);
      };

      return (
        <Space direction="vertical" size={0}>
          <ul style={{ 
            margin: 0, 
            padding: 0, 
            listStyle: 'none',
            lineHeight: '1.2'
          }}>
            {showExamples.map((example, index) => (
              <li key={index} style={{ margin: 0, padding: 0 }}>
                • {example}
              </li>
            ))}
          </ul>
          {hasMore && (
            <Button
              type="text"
              size="small"
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleExpanded}
              style={{ padding: 0, height: 'auto', fontSize: '11px' }}
            >
              {isExpanded ? 'Show less' : `+${examples.length - 1} more`}
            </Button>
          )}
        </Space>
      );
    },
  },
];
