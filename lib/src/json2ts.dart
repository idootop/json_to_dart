import 'json2dart.dart';

/// Convert JSON to Typescript Classes
///
/// Format is not supported now, you need to do it by yourself. (recommand using [prettier](https://prettier.io))
String json2ts({
  required String className,
  required String jsonStr,
  bool format = false,
}) {
  final dartCode =
      json2dart(className: className, jsonStr: jsonStr, format: false);
  return dartCode.contains('late') ? _dart2ts(dartCode) : dartCode;
}

String _dart2ts(String dartCode) {
  var tsCode = '''
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */

''';
  dartCode = dartCode.replaceAll('Null', 'any');
  dartCode = dartCode.replaceAll('String', 'string');
  dartCode = dartCode.replaceAll('bool', 'boolean');
  dartCode = dartCode.replaceAll('int?', 'number?');
  dartCode = dartCode.replaceAll('double?', 'number?');
  dartCode = dartCode.replaceAll('int ', 'number ');
  dartCode = dartCode.replaceAll('double ', 'number ');
  dartCode = dartCode.replaceAll('.toList()', '');
  dartCode = dartCode.replaceAll('	);', '  });}');
  dartCode = dartCode.replaceAll('	};', '  };}');
  dartCode = dartCode.replaceAll(
      '	Map<string, dynamic> toJson() => {', '  public toJson() {return {');
  dartCode =
      dartCode.replaceAll(RegExp(r'.*?\({'), '  public constructor(p: {');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r'List<(.*?)>'), (Match m) => '${m[1]}[]');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r'= (.*?) \?\?'), (Match m) => '= p.${m[1]} ??');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r"\['(.*?)'\]"), (Match m) => '.${m[1]}');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r' late (.*?) (.*?);'), (Match m) => 'public ${m[2]}: ${m[1]};');
  dartCode = dartCode.replaceAllMapped(RegExp(r'map\<(.*?)\>.*?,'),
      (Match m) => 'map((e) => ${m[1]}.fromJson(e)),');
  dartCode =
      dartCode.replaceAllMapped(RegExp(r'		(.*?[^\?])\? (.*?),'), (Match m) {
    if (m[1]!.contains('[]') ||
        ['string', 'number', 'boolean', 'any'].contains(m[1])) {
      return '    ${m[2]}?: ${m[1]};';
    } else {
      return '    ${m[2]}: ${m[1]};';
    }
  });
  dartCode = dartCode.replaceAllMapped(
      RegExp(
          r'factory (.*?)\.fromJson\(Map\<string, dynamic\> json\) =\> (.*?)\('),
      (Match m) =>
          'public static fromJson(json = {} as any): ${m[1]} {return new ${m[1]}({');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r"		'(.*?)' : "), (Match m) => '		${m[1]}: this.');
  dartCode = dartCode.replaceAllMapped(RegExp(r'this\.(.*?) = (.*?)!;'),
      (Match m) => 'this.${m[1]} = p.${m[1]};');
  dartCode = dartCode.replaceAll('int[]', 'number[]');
  dartCode = dartCode.replaceAll('double[]', 'number[]');
  dartCode = dartCode.replaceAll('int.', 'number.');
  dartCode = dartCode.replaceAll('double.', 'number.');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r'\?\? (.*?)\(\);'), (Match m) => '?? ${m[1]}.fromJson({});');
  dartCode = dartCode.replaceAllMapped(
      RegExp(r'\((.*?)\)\.map\(\(e\) =\> (.*?)\.fromJson\(e\)\)'), (Match m) {
    if (['string', 'number', 'boolean'].contains(m[2])) {
      return m[1]!;
    } else {
      return m[0]!;
    }
  });
  tsCode += dartCode;
  return tsCode;
}
