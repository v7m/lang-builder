import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Space, message } from 'antd';
import { WordEntryDocument } from '@/services/database';

const { TextArea } = Input;
const { Option } = Select;

interface EditWordModalProps {
  visible: boolean;
  record: WordEntryDocument | null;
  onCancel: () => void;
  onSave: (updatedRecord: Partial<WordEntryDocument>) => Promise<void>;
}

export default function EditWordModal({ visible, record, onCancel, onSave }: EditWordModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('');

  useEffect(() => {
    if (visible && record) {
      const partOfSpeech = record.grammar?.partOfSpeech;
      setSelectedPartOfSpeech(partOfSpeech || '');

      let formsData = {};
      if (record.forms) {
        if (typeof record.forms === 'string') {
          try {
            formsData = JSON.parse(record.forms);
          } catch {
            formsData = { base: record.forms };
          }
        } else {
          formsData = record.forms;
        }
        console.log('Record forms:', record.forms);
        console.log('Processed forms data:', formsData);
      }

      form.setFieldsValue({
        word: record.word,
        partOfSpeech: partOfSpeech,
        gender: record.grammar?.gender || "",
        regular: record.grammar?.regular,
        translation: record.translations?.ru || '',
        examples: record.examples?.join('\n') || '',
      });

      if (formsData && Object.keys(formsData).length > 0) {
        const formsValues: Record<string, string> = {};
        Object.keys(formsData).forEach(key => {
          formsValues[`forms.${key}`] = (formsData as Record<string, unknown>)[key] as string;
        });
        console.log('Setting forms values:', formsValues);
        form.setFieldsValue(formsValues);
      }
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, record]);

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Starting save process...');
      
      const values = await form.validateFields();
      console.log('Form values:', values);
      
      const gender = values.partOfSpeech === 'noun'
        ? (values.gender === "" ? null
        : values.gender) : null;

      const examples = (values.examples as string)
        .split('\n')
        .filter((line: string) => line.trim());

      console.log('Form values.forms:', values.forms);
      console.log('Part of speech:', values.partOfSpeech);
      
      // Collect forms from individual fields
      let formsData = null;
      const formsFields = Object.keys(values).filter(key => key.startsWith('forms.'));
      
      if (formsFields.length > 0) {
        const formsObject: Record<string, string> = {};
        formsFields.forEach(key => {
          const fieldName = key.replace('forms.', '');
          formsObject[fieldName] = values[key] || '';
        });
        
        console.log('Collected forms object:', formsObject);
        
        switch (values.partOfSpeech) {
          case 'verb':
            formsData = {
              infinitive: formsObject.infinitive || '',
              present3: formsObject.present3 || '',
              preterite: formsObject.preterite || '',
              perfect: formsObject.perfect || '',
            };
            break;
          case 'noun':
            formsData = {
              nominativeSingular: formsObject.nominativeSingular || '',
              genitiveSingular: formsObject.genitiveSingular || '',
              nominativePlural: formsObject.nominativePlural || '',
            };
            break;
          case 'adjective':
          case 'adverb':
            formsData = {
              positive: formsObject.positive || '',
              comparative: formsObject.comparative || '',
              superlative: formsObject.superlative || '',
            };
            break;
          default:
            formsData = {
              base: formsObject.base || '',
            };
        }
      }
      console.log('Processed forms data:', formsData);
      
      const updatedRecord: Partial<WordEntryDocument> = {
        word: values.word,
        grammar: {
          partOfSpeech: values.partOfSpeech,
          gender: gender,
          regular: values.regular,
        },
        translations: {
          ru: values.translation,
        },
        forms: formsData,
        examples: examples,
      };

      await onSave(updatedRecord);
      
      messageApi.success('Word entry updated successfully');
      form.resetFields();
    } catch (error) {
      console.error('Save error:', error);
      messageApi.error('Failed to update word entry');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Word"
        open={visible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        width={600}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="word"
            label="Word"
            rules={[{ required: true, message: 'Please enter the word' }]}
          >
            <Input placeholder="Enter German word" />
          </Form.Item>

          <Space style={{ width: '100%' }}>
            <Form.Item
              name="partOfSpeech"
              label="Part of Speech"
              rules={[{ required: true, message: 'Please select part of speech' }]}
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Select part of speech"
                onChange={(value) => setSelectedPartOfSpeech(value)}
              >
                <Option value="noun">Noun</Option>
                <Option value="verb">Verb</Option>
                <Option value="adjective">Adjective</Option>
                <Option value="adverb">Adverb</Option>
                <Option value="preposition">Preposition</Option>
                <Option value="conjunction">Conjunction</Option>
                <Option value="pronoun">Pronoun</Option>
                <Option value="interjection">Interjection</Option>
              </Select>
            </Form.Item>

            {selectedPartOfSpeech === 'noun' && (
              <Form.Item
                name="gender"
                label="Gender"
                style={{ flex: 1, minWidth: '120px' }}
              >
                <Select placeholder="Select gender" style={{ width: '100%' }}>
                  <Option value="">None</Option>
                  <Option value="masculine">Masculine</Option>
                  <Option value="feminine">Feminine</Option>
                  <Option value="neuter">Neuter</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="regular"
              label="Regular"
              valuePropName="checked"
              style={{ flex: 1 }}
            >
              <Switch />
            </Form.Item>
          </Space>

          <Form.Item
            name="translation"
            label="Translation (Russian)"
          >
            <TextArea 
              placeholder="Enter Russian translation" 
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </Form.Item>

          {selectedPartOfSpeech === 'verb' && (
            <Space style={{ width: '100%' }}>
              <Form.Item
                name="forms.infinitive"
                label="Infinitive"
                style={{ flex: 1 }}
              >
                <Input placeholder="e.g., machen" />
              </Form.Item>
              <Form.Item
                name="forms.present3"
                label="Present 3rd"
                style={{ flex: 1 }}
              >
                <Input placeholder="e.g., macht" />
              </Form.Item>
              <Form.Item
                name="forms.preterite"
                label="Preterite"
                style={{ flex: 1 }}
              >
                <Input placeholder="e.g., machte" />
              </Form.Item>
              <Form.Item
                name="forms.perfect"
                label="Perfect"
                style={{ flex: 1 }}
              >
                <Input placeholder="e.g., hat gemacht" />
              </Form.Item>
            </Space>
          )}

          {selectedPartOfSpeech === 'noun' && (
              <Space style={{ width: '100%' }}>
                <Form.Item
                  name="forms.nominativeSingular"
                  label="Nominative Singular"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., Mann" />
                </Form.Item>
                <Form.Item
                  name="forms.genitiveSingular"
                  label="Genitive Singular"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., Mannes" />
                </Form.Item>
                <Form.Item
                  name="forms.nominativePlural"
                  label="Nominative Plural"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., Männer" />
                </Form.Item>
              </Space>
            )}

            {selectedPartOfSpeech === 'adjective' && (
              <Space style={{ width: '100%' }}>
                <Form.Item
                  name="forms.positive"
                  label="Positive"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., schön" />
                </Form.Item>
                <Form.Item
                  name="forms.comparative"
                  label="Comparative"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., schöner" />
                </Form.Item>
                <Form.Item
                  name="forms.superlative"
                  label="Superlative"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., am schönsten" />
                </Form.Item>
              </Space>
            )}

            {selectedPartOfSpeech === 'adverb' && (
              <Space style={{ width: '100%' }}>
                <Form.Item
                  name="forms.positive"
                  label="Positive"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., schnell" />
                </Form.Item>
                <Form.Item
                  name="forms.comparative"
                  label="Comparative"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., schneller" />
                </Form.Item>
                <Form.Item
                  name="forms.superlative"
                  label="Superlative"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="e.g., am schnellsten" />
                </Form.Item>
              </Space>
            )}

          {!['verb', 'noun', 'adjective', 'adverb'].includes(selectedPartOfSpeech) && selectedPartOfSpeech && (
            <Form.Item
              name="forms.base"
              label="Base Form"
            >
              <Input placeholder="Enter base form" />
            </Form.Item>
          )}

          <Form.Item
            name="examples"
            label="Examples (one per line)"
          >
            <TextArea 
              rows={4} 
              placeholder="Enter example sentences, one per line"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
