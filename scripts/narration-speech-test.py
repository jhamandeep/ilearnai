import json
import pathlib
import unittest
from narration_speech import number, spoken, speaker_for


class TeachingPronunciation(unittest.TestCase):
    def test_exact_numbers(self):
        for raw, expected in [('0.0003','zero point zero zero zero three'), ('-12.05','minus twelve point zero five'), ('245000.0','two hundred and forty-five thousand point zero'), ('3.50','three point five zero'), ('1,470,000','one million, four hundred and seventy thousand')]:
            self.assertEqual(number(raw), expected)
            self.assertEqual(spoken(raw + '.'), expected + '.')

    def test_context_changes_reading(self):
        self.assertEqual(spoken('Python 3.12'), 'Python three point twelve')
        self.assertEqual(spoken('3.12'), 'three point one two')
        self.assertEqual(spoken('208.80.154.224'), 'two hundred and eight dot eighty dot one hundred and fifty-four dot two hundred and twenty-four')
        self.assertEqual(spoken('3e-4'), 'three times ten to the power of minus four')
        self.assertEqual(spoken('7e9'), 'seven times ten to the power of nine')
        self.assertEqual(spoken('90 - 30 = 60'), 'ninety minus thirty equals sixty')
        self.assertEqual(spoken('1/5 = 0.2'), 'one divided by five equals zero point two')
        self.assertEqual(spoken('20%'), 'twenty percent')
        self.assertEqual(spoken('7B × 4'), 'seven billion times four')
        self.assertEqual(spoken('$0.002'), 'zero point zero zero two dollars')
        self.assertEqual(spoken('1st, 2nd, 3rd'), 'first, second, third')
        self.assertEqual(spoken('2.25x + 37.5'), 'two point two five x plus thirty-seven point five')
        self.assertEqual(spoken('x²'), 'x squared')

    def test_names_and_units(self):
        self.assertEqual(spoken('PyTorch OpenAI OpenCV FastAPI'), 'Pie Torch Open A I Open C V Fast A P I')
        self.assertEqual(spoken('GPU GPUs API APIs'), 'G P U graphics processors A P I application programming interfaces')
        self.assertEqual(spoken('80 GB, 320 KB, 7.5 ms'), 'eighty gigabytes, three hundred and twenty kilobytes, seven point five milliseconds')
        self.assertEqual(spoken('Ada and Maya use pandas.'), 'Ada and Maya use pandas.')
        self.assertEqual(spoken('ModuleNotFoundError'), 'Module Not Found Error')

    def test_entire_corpus_and_teaching_turns(self):
        path = pathlib.Path(__file__).resolve().parent.parent / 'output/narration/scripts.json'
        for entry in json.loads(path.read_text()):
            with self.subTest(entry=entry['title']):
                self.assertEqual({speaker_for(i) for i in range(len(entry['texts']))}, {'female','male'})
                for text in entry['texts']:
                    self.assertTrue(spoken(text))
        self.assertEqual([speaker_for(i) for i in range(6)], ['female','female','male','male','female','female'])


if __name__ == '__main__':
    unittest.main()
