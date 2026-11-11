// Código común para calificar Java: el "Runner" se compila junto al código del estudiante.
// Redirige System.in/out, ejecuta Main.main y guarda la salida en un archivo (argumento 0).
// Un hilo vigilante corta ejecuciones que duren demasiado (ciclos infinitos).
export const RUNNER_SRC = `
import java.io.*;
import java.util.Base64;

public class Runner {
  static ByteArrayOutputStream bo = new ByteArrayOutputStream();
  static String outFile;

  static void save() {
    try {
      FileOutputStream f = new FileOutputStream(outFile);
      f.write(bo.toByteArray());
      f.close();
    } catch (Throwable t) { }
  }

  public static void main(String[] args) throws Exception {
    outFile = args[0];
    String input = args.length > 1 && args[1].length() > 0
        ? new String(Base64.getDecoder().decode(args[1]), "UTF-8") : "";
    PrintStream ps = new PrintStream(bo, true, "UTF-8");
    System.setOut(ps);
    System.setErr(ps);
    System.setIn(new ByteArrayInputStream(input.getBytes("UTF-8")));
    Thread guard = new Thread(new Runnable() {
      public void run() {
        try { Thread.sleep(10000); } catch (InterruptedException e) { return; }
        ps.println("[Tiempo agotado: el programa tardó demasiado (¿ciclo infinito?)]");
        save();
        Runtime.getRuntime().halt(2);
      }
    });
    guard.setDaemon(true);
    guard.start();
    try {
      Main.main(new String[0]);
    } catch (Throwable t) {
      ps.println("Exception in thread \\"main\\" " + t);
      for (StackTraceElement e : t.getStackTrace()) { ps.println("\\tat " + e); break; }
    }
    ps.flush();
    save();
    Runtime.getRuntime().halt(0);
  }
}
`;

export function normOut(s) {
  return String(s || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
}

export function b64(s) {
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(s)));
  return Buffer.from(s, 'utf8').toString('base64');
}

// Un ejercicio Java define tests: [{input, expected}]. Si solo hay expected, se usa un único test sin entrada.
export function testsOf(ex) {
  return ex.tests || [{ input: ex.input || '', expected: ex.expected }];
}
