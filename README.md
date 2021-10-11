# JSON to Class

Given a JSON string, this library will generate all the necessary Dart / Typescript classes to parse and generate JSON.

## Usage

```yaml
dependencies:
  ...
  json2class:
    git:
      url: https://github.com/idootop/json_to_dart.git
```

```dart
import 'package:json2class/json2class.dart';

void main() async {
  final jsonStr = '''
    {
      "code": 404,
      "msg": "Not found!"
    }
  ''';
  final dartCode = json2dart(className: 'HttpError', jsonStr: jsonStr);
  final tsCode = json2ts(className: 'HttpError', jsonStr: jsonStr);
}
```

This will generate something like this:

```dart
class HttpError {
  late int code;
  late String msg;

  HttpError({
    int? code,
    String? msg,
  }) {
    this.code = code ?? 0;
    this.msg = msg ?? '';
  }

  factory HttpError.fromJson(Map<String, dynamic> json) => HttpError(
        code: json['code'],
        msg: json['msg'],
      );

  Map<String, dynamic> toJson() => {
        'code': code,
        'msg': msg,
      };
}
```

```typescript
class HttpError {
  public code: number;
  public msg: string;

  public constructor(p: { code?: number; msg?: string }) {
    this.code = p.code ?? 0;
    this.msg = p.msg ?? "";
  }

  public static fromJson(json = {} as any): HttpError {
    return new HttpError({
      code: json.code,
      msg: json.msg,
    });
  }

  public toJson() {
    return {
      code: this.code,
      msg: this.msg,
    };
  }
}
```

## Acknowledgement

This library is based on [javiercbk](https://github.com/javiercbk)'s [json2class](https://github.com/javiercbk/json_to_dart).
