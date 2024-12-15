import type { Recipient } from '@/types/matching';

interface RecipientDetailsProps {
  recipient: Recipient;
}

export function RecipientDetails({ recipient }: RecipientDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recipient Details</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Medical Record Number</p>
          <p className="font-medium">{recipient.mrn}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">National ID</p>
          <p className="font-medium">{recipient.nationalId}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-medium">{recipient.fullName}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Blood Type</p>
          <p className="font-medium">{recipient.bloodType}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">PRA %</p>
          <p className="font-medium">{recipient.pra}%</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Crossmatch Requirement</p>
          <p className="font-medium">{recipient.crossmatchRequirement}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">HLA Typing</h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recipient.hlaTyping && (
            <>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-A</p>
                <p className="font-medium">{recipient.hlaTyping.hlaA || 'N/A'}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-B</p>
                <p className="font-medium">{recipient.hlaTyping.hlaB || 'N/A'}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-C</p>
                <p className="font-medium">{recipient.hlaTyping.hlaC || 'N/A'}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-DR</p>
                <p className="font-medium">{recipient.hlaTyping.hlaDR || 'N/A'}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-DQ</p>
                <p className="font-medium">{recipient.hlaTyping.hlaDQ || 'N/A'}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">HLA-DP</p>
                <p className="font-medium">{recipient.hlaTyping.hlaDP || 'N/A'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}