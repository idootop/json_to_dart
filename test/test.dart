import 'dart:io';
import 'package:json2class/json2class.dart';

void main() async {
  final jsonStr = '''
    {
      "code": 404,
      "msg": "Not found!"
    }
  ''';
  final dartCode = json2dart(className: 'HttpError', jsonStr: jsonStr);
  await File('test/error.dart').writeAsString(dartCode);
  final tsCode = json2ts(className: 'HttpError', jsonStr: jsonStr);
  await File('test/error.ts').writeAsString(tsCode);
  print('>>> done!');
}
