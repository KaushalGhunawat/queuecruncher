
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const QRCode = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [qrUrl, setQrUrl] = useState('');
  const baseUrl = window.location.origin;

  useEffect(() => {
    if (user) {
      setQrUrl(`${baseUrl}/queue/join/${user.id}`);
    }
  }, [user, baseUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      toast({
        title: 'Success',
        description: 'URL copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code');
    if (canvas) {
      const pngUrl = canvas
        .querySelector('svg')
        ?.outerHTML
        .replace('svg', 'svg xmlns="http://www.w3.org/2000/svg"');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = `data:image/svg+xml;base64,${btoa(pngUrl || '')}`;
      downloadLink.download = 'qr-code.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">QR Code</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Queue QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              id="qr-code"
              className="bg-white p-4 rounded-lg inline-block"
            >
              <QRCodeSVG 
                value={qrUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="space-y-2">
              <Button onClick={downloadQR} className="w-full">
                Download QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={qrUrl} readOnly />
              <Button onClick={copyToClipboard} className="shrink-0">
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this URL directly or use the QR code to let customers join your queue.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCode;
